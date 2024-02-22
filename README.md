![](https://img-blog.csdnimg.cn/e89f3778708e4e86ae32788ae3fad029.png)

## Usage

1. `git clone https://github.com/SummerGua/gitlet.git`
2. `cd gitlet`
3. `npm link`
4. try commands from `gitlet -h`

## TODO

- add:
  1. √ 如果`gitlet.add(文件)`，文件存在则 addIndex，不存在则从 index 中删除；
  2. √ 如果`gitlet.add(文件夹)`：找到文件夹下所有文件，遍历文件，重复 1
- branch(branch_name?:string):
  - √ 不含参数：查看所有分支和当前分支
  - √ 传参：创建分支（在 refs/heads/下新建一个文件），如果已经有，则提示：a branch named `<branch_name>` already exists
- commit 发生了什么：
  - √ 创建一个 commit object，包含：index 内容，parent 指向上一次 commit 的 40hash，日期、消息
  - √ **注意**：index 内容在 commit 之后不会清空，git 如何判断当前没有需要提交的呢？对比工作区和 index 中的内容

## LOG

2/22

- 支持`gitlet log`
- 使用`commandar`

2/6

- 分支相关基本完成
- 支持命令行

2/5

- 差不多完成了 `gitlet.write_tree()`
- 难点：把`'./src/test.js'转为树`

2/3

- 补完了 `add` 的从 index 中移除**文件**的功能，但是移除整个文件夹没有做

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

## REFERENCE

- https://ndpsoftware.com/git-cheatsheet.html#loc=index;
- https://marklodato.github.io/visual-git-guide/index-zh-cn.html
- http://gitlet.maryrosecook.com/docs/gitlet.html
- https://cs61bl.org/su17/materials/proj/proj2/proj2.html#f-the-commands
- https://www.leshenko.net/p/ugit/#status-show-staged
