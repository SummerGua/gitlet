![](https://img-blog.csdnimg.cn/e89f3778708e4e86ae32788ae3fad029.png)

TODO

- add: index 里有但是目录下没有，可以正常 commit。但是如果执行 git，则从 index 中删除 ( line55)
- branch(branch_name?:string):
  - 不含参数：查看分支
  - 传参：切换分支

1/26

- 添加了`git init`的单元测试

1/25

- add: 可以添加 path—>hash 的映射到 index 中、**永久**压缩文件内容到 objects 中。会匹配文件参数是否存在，但是不能添加删除的文件
- cat-file: 可以查看类型、文件内容、文件大小

1/24

- init 初始化目录
- add 做了一半
