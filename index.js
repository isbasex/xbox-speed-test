const fs = require('fs')
const { execFile } = require('child_process')
const { promisify } = require('util')

const execFileAsync = promisify(execFile)

const isCN = process.env.isCN != null
// 并发数：默认 1（串行），以保证测速准确。并发会让各节点争抢带宽，结果偏低。
const concurrency = Math.max(1, Number(process.env.CONCURRENCY) || 1)
// 单节点超时（秒），可通过 TIMEOUT 覆盖
const timeout = Math.max(1, Number(process.env.TIMEOUT) || 8)

const HOST = isCN ? 'assets1.xboxlive.cn' : 'assets1.xboxlive.com'
const RANGE = isCN ? '0-337437055' : '33543139328-33752035327'
const URL_PATH = isCN
  ? '/5/0454fb03-6c81-496a-aee8-96c8e338941e/a124f922-f8fa-412c-84c1-f418ee71632a/1.0.0.21.a3ef4e36-0cfb-47b0-9eda-eab7cb5c076c/EastshadeStudios.Eastshade_1.0.0.21_neutral__dc285gd3x0dar'
  : '/5/795514b6-aad9-4c1c-ac2a-60c1492d7f31/0c57204f-f4f0-4bf6-b119-b7afc231994d/0.0.61375.0.6574fcb5-72f2-4c85-98c1-bd1059c79934/Destiny2_0.0.61375.0_neutral__z7wx9v9k22rmg'

function loadCdnList() {
  const file = isCN ? './cdn-cn.list' : './cdn.list'
  const lines = fs
    .readFileSync(file, 'utf8')
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
  return [...new Set(lines)] // 去重，避免重复测同一节点
}

async function testIp(ip) {
  const args = [
    '-s',
    '-o',
    '/dev/null',
    '-m',
    String(timeout),
    '-r',
    RANGE,
    '-y',
    '5',
    '--url',
    `http://${ip}${URL_PATH}`,
    '-H',
    `Host: ${HOST}`,
    '-w',
    '%{speed_download}',
  ]
  try {
    const { stdout } = await execFileAsync('curl', args)
    return { ip, speed: Number(stdout) || 0 }
  } catch (err) {
    // curl 超时/中断会返回非 0 退出码，但仍可能在 stdout 写出已测得的速度
    const out = err && err.stdout
    return { ip, speed: out ? Number(out) || 0 : 0 }
  }
}

function formatSpeed(bytesPerSec) {
  return (bytesPerSec / 1000000).toFixed(2) + ' Mb/s'
}

function formatIp(ip) {
  return ip.padEnd(15, ' ')
}

// 固定并发数的任务池，按原始顺序返回结果
async function runPool(items, worker, limit) {
  const results = new Array(items.length)
  let next = 0
  async function consume() {
    while (next < items.length) {
      const index = next++
      results[index] = await worker(items[index], index)
    }
  }
  const workers = Array.from(
    { length: Math.min(limit, items.length) },
    consume,
  )
  await Promise.all(workers)
  return results
}

async function main() {
  const cdnList = loadCdnList()
  if (cdnList.length === 0) {
    console.error('节点列表为空，请检查 cdn.list / cdn-cn.list')
    process.exit(1)
  }

  const total = cdnList.length
  console.log(`测试中...（共 ${total} 个节点，并发 ${concurrency}）\n`)

  let done = 0
  const result = await runPool(
    cdnList,
    async (ip) => {
      const item = await testIp(ip)
      done += 1
      const progress = `[${String(done).padStart(String(total).length)}/${total}]`
      console.log(
        `${progress} [ip] ${formatIp(item.ip)} [speed] ${formatSpeed(item.speed)}`,
      )
      return item
    },
    concurrency,
  )

  console.log('\n下载速度排序')
  result
    .sort((a, b) => b.speed - a.speed)
    .forEach((item) => {
      console.log(`[ip] ${formatIp(item.ip)} [speed] ${formatSpeed(item.speed)}`)
    })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
