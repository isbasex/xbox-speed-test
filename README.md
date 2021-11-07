# Xbox SpeedTest (Node.js 实现)

## [解决 Xbox 在国内下载速度慢](https://baiyun.me/fix-slow-xbox-download-speed)

## 使用方法

安装

```shell
git clone https://github.com/isbasex/xbox-speed-test.git
```

运行测试

```shell
node index.js
```

![测试中](https://i.isbase.me/resource/uPic/20211023022010-A0LGxu.jpg)

测试结束后会输出各节点的速度排序表：

![下载速度排序](https://i.isbase.me/resource/uPic/20211023023740-W58qdL.jpg)

### Docker 运行

如果你本地没有正确的 node 环境，可以尝试用 docker 运行

```shell
docker run --rm -v `pwd`:/tmp/xbox node sh -c "cd /tmp/xbox && node index.js"
```

## 感谢

- [wmltogether/XboxSpeedTest](https://github.com/wmltogether/XboxSpeedTest)
