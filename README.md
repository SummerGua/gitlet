![](https://img-blog.csdnimg.cn/e89f3778708e4e86ae32788ae3fad029.png)

## TODO

- add:
  1. 如果`gitlet.add(文件)`，文件存在则 addIndex，不存在则从 index 中删除；
  2. 如果`gitlet.add(文件夹)`：找到文件夹下所有文件，遍历文件，重复 1
- branch(branch_name?:string):
  - 不含参数：查看分支
  - 传参：创建分支（在 refs/heads/下新建一个文件），如果已经有，则提示：a branch named `<branch_name>` already exists

## LOG

1/27

- 添加了`rm`，可以同时移除 index 和工作区中的文件
- 添加了`rm`的单元测试
- 将 index 的内容从`/README.md 40@hash`改为`./README.md 40@hash`

1/26

- 添加了`git init`的单元测试

1/25

- add: 可以添加 path—>hash 的映射到 index 中、**永久**压缩文件内容到 objects 中。会匹配文件参数是否存在，但是不能添加删除的文件
- cat-file: 可以查看类型、文件内容、文件大小

1/24

- init 初始化目录
- add 做了一半
