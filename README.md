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

## 节点 ip 自助更新

这个仓库里的 cdn.list 和 cdn-cn.list 文件内置了世界各地的 Xbox CDN 节点，
这些节点随着时间的推移可能会有部分失效，你可以自行通过 dig 命令配合各国的公共 DNS 查找最新的有效 CDN 节点，
也可以删除无效和特别慢的节点。

### 更新 cdn-cn.list（国内下载节点）

```shell
dig assets1.xboxlive.cn @119.29.29.29

dig assets1.xboxlive.cn @223.6.6.6

dig assets1.xboxlive.cn @114.114.114.114
```

### 更新 cdn.list（国际下载节点）

```shell
dig assets1.xboxlive.com @119.29.29.29

dig assets1.xboxlive.com @223.6.6.6

dig assets1.xboxlive.com @114.114.114.114
```

@ 后面的 DNS 服务器地址可以自行替换，https://public-dns.info/ 这里有很多世界各地的公共 DNS 服务器地址。

macOS 自带 dig 命令，Windows 用户建议用 WSL。

### Docker 运行

如果你本地没有正确的 node 环境，可以尝试用 docker 运行

```shell
docker run --rm -v `pwd`:/tmp/xbox node sh -c "cd /tmp/xbox && node index.js"
```

## 感谢

- [wmltogether/XboxSpeedTest](https://github.com/wmltogether/XboxSpeedTest)
