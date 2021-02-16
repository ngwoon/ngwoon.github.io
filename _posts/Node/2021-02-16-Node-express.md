---
title: Express.js
author: ngwoon
layout: post
categories:
- Network
tags:
- node.js
- express.js
- app
- 미들웨어
---

# [Node.js] Express.js
- - -

# app

```jsx
const express = require("express");
const app = express();
```

express 내부에 http 모듈이 내장되어 있으므로, 웹 서버의 역할을 할 수 있다.<br/>
app 변수에는 크게 세 가지 종류의 메서드가 존재한다.

- **app.set(key, value)**<br/>
    key-value을 저장할 때 사용한다.<br/>
    app.get(key)로 value를 꺼낼 수 있다.

- **app.use(미들웨어)**<br/>
    미들웨어를 등록할 때 사용한다.<br/>
    **미들웨어는 등록된 순서대로 수행된다는 사실을 기억하자.** 

- **app.get(주소, 라우터)**<br/>
    주소에 대한 라우터를 등록할 때 사용한다.<br/>
    app.get은 get 요청에 대한 라우터를 등록한다는 뜻이다.<br/>
    HTTP method 각각에 대응하는 라우터 등록 방법이 존재한다.<br/>
    (app.post, app.delete, app.put, app.patch, app.options)

# 미들웨어

미들웨어는 express 프레임워크의 전부라고 해도 과언이 아닐 만큼 중요하다. 라우터 혹은 에러 핸들러 또한 미들웨어의 일종이다. **미들웨어는 요청과 응답의 사이에서 요청 데이터 및 응답 데이터를 가공하여 보다 깔끔하고 정교한 아키텍쳐를 구성하는데 도움을 준다.**<br/>
기본적으로 express에서는 **app.use()**를 사용하여 미들웨어를 등록한다.

```jsx
const express = require("express");
const app = express();

app.use((req, res, next) => {
		// 미들웨어 내용..
});

app.use("/", (req, res, next) => {
		// 미들웨어 내용..
});
```

미들웨어는 **req, res, next 라는 세 개의 매개변수를 갖는 함수 형태**이다.<br/>
미들웨어는 **등록된 순서대로 수행**되므로, 미들웨어 등록 순서가 결과에 영향을 미친다는 것을 알아두자!<br/>
app.use()에 주소를 인자로 주지 않으면 모든 요청에 대해 실행되고, 주소를 인자로 주면 해당하는 요청에서만 실행된다.<br/>
next() 를 호출하면 다음 미들웨어로 넘어간다. next('router') 는 다음 라우터로 흐름이 넘어가고, 그 외의 인자를 넘겨주면 에러 핸들러로 넘어간다.<br/>
app.use나 app.get 같은 라우터에 미들웨어를 2개 이상 등록할 수도 있다. 마찬가지로 next()를 호출하면 다음 미들웨어로 넘어간다.<br/>
에러 핸들러는 일반 라우터와 조금 다르다. **err, req, res, next 네 개의 매개변수**를 갖는다.

## 자주 사용되는 미들웨어

express에서 자주 사용되는 미들웨어들이 무엇이 있는지 알아보고, 어떻게 사용하는지 간단하게 살펴보자.

### morgan

요청과 관련된 로그를 띄워주는 미들웨어이다.<br/>
`app.use(morgan("dev"));` 와 같이 등록한다.<br/>
morgan의 옵션으로  dev, combined, common, short, tiny 등이 존재하며, 일반적으로 개발 시에는 dev, 배포 환경에서는 combined가 사용된다.

### static

정적 파일의 기본 위치를 설정해주는 미들웨어이다.<br/>
`app.use(express.static(path.join(__dirname, "public")));` 과 같이 쓰인다.<br/>
express 프레임워크에 내장되어 있으므로 별도의 설치가 필요 없다.<br/>
사용자로부터 정적 파일의 서버 내 위치를 숨길 수 있어서 보안적으로 좋은 방법이다.

### body-parser

post 요청과 같이 body가 존재하는 요청에서 body의 내용을 req.body로 옮겨주는 역할을 한다.<br/>
단, multipart/form-data 요청의 경우 body-parser로 파싱할 수 없다. 이 때는 multer 미들웨어를 사용한다.<br/>
등록 방법은 아래와 같다.<br/>
```jsx
// express에 내장된 body-parser 사용
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// body-parser 미들웨어 사용
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
```

express 버전 4.16.0 부터는 body-parser의 일부 기능이 express 프레임워크에 내장되어 있다.<br/>
단, text나 raw body는 express 내장 기능으로는 파싱할 수 없으므로, 이 때는 body-parser를 사용해야 한다.<br/>
extended가 false이면 querystring 모듈을 이용하고, true 이면 qs 모듈을 이용한다는 차이가 있다.

### cookie-parser

요청에 동봉된 쿠키를 파싱하여 req.cookies 객체로 만든다.<br/>
`app.use(cookieParser(비밀키));` 로 등록할 수 있다.<br/>
유효기간이 지난 쿠키는 cookie-parser 미들웨어가 알아서 걸러낸다.<br/>
쿠키를 생성할 때 서명 옵션을 사용했다면, cookie-parser 미들웨어를 등록할 때 서명에 사용한 비밀키를 인자로 주어야 한다. 이 때는 req.cookies가 아닌 req.signedCookies 객체에 쿠키 값이 들어간다.<br/>
cookie-parser는 요청에 담긴 쿠키를 파싱하는 역할을 한다. 쿠키를 생성할 때에는 res.cookie로 생성한다. res.cookie(키, 값, 옵션) 형태로 쿠키를 생성할 수 있다. <br/>
```jsx
res.cookie("name", "ngwoon", {
		expires: new Date(Date.now() + 900000),
		httpOnly: true,
		secure: true,
});
```

### express-session

말 그대로 세션을 생성하는 미들웨어이다. 아래와 같이 등록할 수 있다.<br/>
```jsx
app.use(session({
		resave: false,
		saveUninitialized: false,
		secret: process.env.COOKIE_SECRET,
		cookie: {
				httpOnly: true,
				secure: false,
		},
		name: "session-cookie",
}));
```

암호화된 세션 쿠키를 사용하려면 secret 옵션에 비밀 키를 주어야 한다.<br/>
cookie는 세션 쿠키에 대한 설정이다.<br/>
name은 세션 쿠키의 이름이다. 기본 값은 "connect.sid" 이다.<br/>
일반적으로 세션은 redis나 memcached와 같은 메모리 기반 DB에 저장한다. 이 때는 store 옵션에 사용할 DB를 연결해주는 작업이 필요하다. 여기서는 다루지 않는다.