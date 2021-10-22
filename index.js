const fs = require('fs')
const childProcess = require('child_process')

const isCN = process.env.isCN != null

const cdnList = fs
  .readFileSync(isCN ? './cdn-cn.list' : './cdn.list', 'utf8')
  .split('\n')
  .map((item) => item.trim())
  .filter(Boolean)

async function main() {
  const result = []
  console.log('测试中...\n')
  for (const ip of cdnList) {
    const com = `http://${ip}/5/795514b6-aad9-4c1c-ac2a-60c1492d7f31/0c57204f-f4f0-4bf6-b119-b7afc231994d/0.0.61375.0.6574fcb5-72f2-4c85-98c1-bd1059c79934/Destiny2_0.0.61375.0_neutral__z7wx9v9k22rmg -H "Host: assets1.xboxlive.com"`
    const cn = `http://${ip}/5/0454fb03-6c81-496a-aee8-96c8e338941e/a124f922-f8fa-412c-84c1-f418ee71632a/1.0.0.21.a3ef4e36-0cfb-47b0-9eda-eab7cb5c076c/EastshadeStudios.Eastshade_1.0.0.21_neutral__dc285gd3x0dar -H "Host: assets1.xboxlive.cn"`

    function handler(output) {
      const stdout = Number(output)
      const speed = (stdout / 1000000).toFixed(2)
      const speedStr = speed + ' Mb/s'
      console.log(`[ip] ${formatIp(ip)} [speed] ${speedStr}`)
      result.push({ ip, speed: stdout, speedStr })
    }

    try {
      const out = await childProcess.execSync(
        `curl -s -o /dev/null -m 8 -r ${
          isCN ? '0-337437055' : '33543139328-33752035327'
        } -y 5 --url ${isCN ? cn : com} -w "%{speed_download}"`,
      )
      handler(out.toString())
    } catch (err) {
      if (err?.stdout) {
        handler(err.stdout.toString())
      } else {
        throw err
      }
    }
  }
  console.log('\n下载速度排序')
  sortAndPrint(result)
}

function sortAndPrint(result) {
  result
    .sort((a, b) => b.speed - a.speed)
    .forEach((item) => {
      console.log(`[ip] ${formatIp(item.ip)} [speed] ${item.speedStr}`)
    })
}

function formatIp(ipStr) {
  const chars = ipStr.split('')
  const diff = 15 - chars.length
  chars.push(...Array.from({ length: diff }).map((v) => ' '))
  return chars.join('')
}

main().catch(console.error)
