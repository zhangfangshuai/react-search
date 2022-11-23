# react-search

### 项目需求
1. 通过页面上的输入框输入的关键字，点击搜索按钮，搜素到github的用户信息列表
2. github用户信息是分页返回的，页面实现分页展示
3. 点击用户头像，进入github仓库主页

&emsp;

### 代码风格要求
1. 组件间通信通过发布-订阅机制来实现，保持App组件的干净整洁
2. 不必要使用Ref时不用Ref，如使用`event.target`、受控组件等方案，具体选择看业务情况
3. 用户信息列表，
   - 首次未搜索时，展示欢迎页。
   - 用户开始搜索，结果未返回，展示loading交互页
   - 用户搜索完成且正确返回数据时，展示数据列表。
   - 用户搜索完成且无数据时，展示空数据占位符。
   - 用户搜索失败，展示错误信息。

&emsp;

### 使用PubSubJS库完成组件间通信
本案例因为项目需求很简单，暂不使用Redux来实现应用状态的管理
##### 1、安装PubSubJS库
```bash
npm i pubsub-js
yarn add pubsub-js
```

##### 2、引入PubSubJS
```js
// ES6
import PubSub from 'pubsub-js'

// CommonJS
const PubSub = require('pubsub-js')
```

##### 3、使用PubSubJs
```js
// 订阅消息
componentDidMount() {
    // token为false时，表示消息订阅失败
    const token = PubSub.subscribe('MY TOPIC', (msg, data) => {
        // callback function
        // 'MY TOPIC'，发布-订阅方约定的识别名，可随意命名。
        // msg-订阅的消息名，即'MY TOPIC'，一般第一个参数不要，用下划线‘_’占位即可
        // data-发布者发布的消息，传递过来的数据
    })
}

// 发布消息
// 有返回值为bool值，表示消息是否发布成功
PubSub.publish('MY TOPIC', data)  // data-发布者发布的消息，要发送的数据

// 发布异步消息
PubSub.publishSync('MY TOPIC', 'Hello World')

// 取消订阅
componentWillUnMount() {
    PubSub.unsubscribe(token) // 取消指定的消息
    PubSub.clearAllSubscriptions() // 取消所有已订阅的消息
}

// 检查当前订阅的消息有多少发布者
PubSub.countSubscriptions('token')
```

##### 4、PubSubJS最佳实践
```js
// 👍 Better usage
var MY_TOPIC = 'hello'
PubSub.subscribe(MY_TOPIC, (_, data) => {
	console.log(data)
})

PubSub.publish(MY_TOPIC, 'world')
```

&emsp;

### 发起Ajax请求

#### 1、利用最原始的xhr发送Ajax请求
原生提供，无需安装第三方插件
```js
const api = `https://api.github.com/search/users?1=${keywords}`
// 创建XHR对象
const xhr = new XMLHttpRequest()
// 掉哟工open函数，指定请求方式与URL地址
xhr.open('get', api)

// 指定成功的回调
xhr.onload = function() {
    console.log(xhr.response)
}
// 指定失败的回调
xhr.onerror = function() {
    console.log('Oops, error')
}

// 调用send发起Ajax请求
xhr.send()

// 监听请求状态 - 过程监听
xhr.onreadystatechange = function() {
    // 监听xhr对象的请求状态readyState，服务器响应状态state
    if (xhr.readyState === 4 && xhr.status === 200) {
        console.log(xhr.responseText)
    }
}
```


#### 2、利用axios库发送Ajax请求（推荐）
**axios是基于Promise，依赖于xhr的ajax的二次封装库**，其技术成熟，用法简单，能很好解决如JQuery回调地狱问题，使用前需安装axios包。

axios还提供了**请求拦截器**，**响应拦截器**，**请求取消**等功能，支持**自定义全局请求配置，动态局部请求配置覆盖**等功能，非常适合前端开发者使用。
```js
// get请求
import axios from 'axios'
// 未对axios执行二次封装时get请求的用法
const api = 'https://api.github.com/search/users'
axios.get(`${api}?keywords=${this.keywords}`).then(res => {
    // success callback
}).catch(error => {
    // error callback
}).finally(() => {
    // finally handler
})

// post请求
axios.post(api, {
    keywords: this.keywords
}).then(res => {
    // success callback
}).catch(error => {
    // error catcher 
}).finally(() => {
    // finally handler
})
```


#### 3、利用fetch发送Ajax请求（扩展了解）
fetch是web提供的一个可以获取异步资源的api，它与xhr处在相同位置，目前没有被所有浏览器支持。

它提供的api返回的是Promise对象，与xhr不同的是，其设计模式遵循**关注分离**思想，由fetch发起的请求会先询问服务器是否可访问，如果成功，则再去获取数据

fetch也有很多二次封装的库，但因为使用的用户不多，且异步请求的市场一直被axios挤占，了解即可。

##### 1、一个简单的fetch-get请求案例
```js
// get请求
const api = `https://api.github.com/search/users?1=${keywords}`
fetch(url).then(response => {
    // response返回的是握手服务器的结果，而不是请求的数据
    // 执行了.then就表示服务器可达，至于接口是否可达，需再判断
    if (response.status === 200) { // 200-且接口资源存在可访问，401-接口无权限，404-接口不存在
        // json是返回的response的一个原型函数，会把返回的json字符串反序列化成对象，包装成Promise格式返回出去
        return response.json()
    } else {
        return {}
    }
}).then(response => {
    console.log(response) // 返回的是数据
}).catch(error => {
    console.log('请求失败', error)
})
```

##### 2、fetch-get请求的最佳实践
如果`.then`中不执行第二个函数参数即`error => {}`，而如上述使用的是最后的`.catch`，且存在多级链式调用，那么建议改成`async-await`写法
```js
search = async () => {
    const api = `https://api.github.com/search/users?1=${keywords}`
    try {
        const response = await fetch(api)
        const data = await(response.json())
        console.log(data)
    } catch (error) {
        console.log('请求出错‘, error)
    }
}
```
