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

---

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
npm에서 다운받아 사용하는 미들웨어들은 대부분 내부적으로 next()를 호출하기 때문에 자연스럽게 다음 미들웨어로 흐름이 넘어간다.<br/>
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

### multer

이미지, 동영상 등 멀티미디어 파일을 주고받을 때 유용한 미들웨어이다. 프론트측에서 multipart/form-data 형식으로 파일 데이터를 넘겼을 때 이를 처리해주는 역할을 한다.

기본적으로 multer는 프론트에서 보낸 파일을 파싱하여 req.file 객체에 담아준다. multer 인스턴스를 생성할 때 **파일을 저장할 위치**와 **파일이 저장될 이름**을 설정해 주어야 한다.

```jsx
const multer = require("multer");

const upload = mutler({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, "/uploads");
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext);
        }
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});
```

 위 코드는 수신한 멀티미디어 파일의 이름에 현재 시간을 더하도록 수정하고, 이를 uploads 폴더에 저장하는 multer 인스턴스를 생성하는 코드이다.

이렇게 생성된 upload 변수에 여러 미들웨어가 존재한다. 상황에 따라 사용해야하는 미들웨어의 종류가 다르다. 매개변수로 주어지는 필드 이름은 input 태그의 name 속성값을 뜻한다.

- upload.single(필드 이름)

    프론트에서 type이 file인 input이 하나일 때 upload.single 미들웨어로 처리한다.

    파일은 **req.file**에 담긴다.

- upload.array(필드 이름)

    프론트에서 type이 file이고 multiple 속성을 갖는 input으로 파일을 넘길 때(파일 여러 개를 하나의 input을 이용해 보낼 때) upload.array 미들웨어로 처리한다. 

    파일들은 **req.files**에 담긴다.

- upload.fields({ name: 필드 1의 이름 }, { name: 필드 2의 이름})

    type이 file인 input이 여러 개일 때, upload.fields 미들웨어로 처리한다.

    필드 1의 이름이 field1, 필드 2의 이름이 field2라면, 

    ```jsx
    app.use(upload.field({ name: "field1" }, { name: "field2" }), (req, res, next) => {
    		console.log(req.files);
    });
    ```

    와 같이 등록할 수 있다.

    파일들은 req.files.field1, req.files.field2 에 담긴다.

- upload.none()

    파일을 업로드하지 않지만 multipart/form-data 형식으로 데이터를 수신할 때 사용한다. 별다른 인자를 주지 않는다.

---

# 라우터

하나의 js파일에 모든 라우터를 app.use를 사용하여 구현한다면 파일 구조도 복잡해질 뿐더러 가독성도 좋지 않다. 이를 방지하기 위해 express는 Router객체를 제공한다.

```jsx
// routes/index.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res, next) => {
		// 요청, 응답 처리
});

module.exports = router;

// app.js
const express = require("express");
const indexRouter = require("./routes");

app.use("/", indexRouter);
```

routes폴더를 만든 뒤, 이곳에 경로별로 라우터 파일을 구분하여 router 모듈들을 모아둔다. 이를 app.js에서 import 하여 사용할 수 있다.<br/>
(참고로 import시 index.js는 생략할 수 있어서 indexRouter의 require경로를 ./routes만 적어주어도 된다.)<br/>
동일한 라우터를 여러 번 선언할 수 있다.<br/> 
next("route") 를 사용하여 다음 라우터로 흐름을 넘길 수 있다.

```jsx
router.get("/", (req, res, next) => {
    next("route");
}, function(req, res, next) {
    console.log("실행되지 않음");
}, function(req, res, next) {
    console.log("실행되지 않음");
    next();
});

router.get("/", (req, res, next) => {
    console.log("실행됨");
    res.send("hello, express");
});
```

위 예시에서 첫 번째 GET / 요청은 next("route")를 호출했으므로 뒤이어 등록된 미들웨어들은 호출되지 않는다. 다음 라우터인 두 번째 GET / 라우터로 흐름이 넘어간다.<br/>
라우터의 주소에는 정규표현식 및 특수 패턴을 사용할 수 있다. 그 중 가장 대표적인 것이 **경로 파라미터**이다.

```jsx
router.get("/users/:id", (req, res, next) => {
		console.log(req.params, req.query);
});
```

위 예시의 주소 부분에서 ":id" 가 경로 파라미터이며, 이 부분에 오는 문자열 및 숫자는 req.params.id 에 담기게 된다. 만약 :id가 아니라 :type 이라면 req.params.type에 담긴다.<br/>
<font color="red" style="bold">다만, 이렇게 특수 패턴을 사용하는 라우터는 일반 라우터들보다 뒤에 위치해야 한다는 점을 기억하자!!</font>
<br/>
주소 체계에는 **쿼리 파라미터**라는 것도 존재한다. 인터넷 서핑을 하다 보면 주소 뒷부분에 "?name=ngwoon&..." 과 같은 문자열이 붙어있는 것을 본 적이 있을 것이다. 이것이 바로 쿼리 파라미터이다.<br/>
쿼리 파라미터는 req.query에 담기게 된다. 만약 GET  /users/123?name=ngwoon 으로 요청을 보냈다면, 위 예시의 출력 결과는 아래와 같게 된다.

```jsx
{ name: ngwoon }  // req.query
{ id: 123 }       // req.params
```

## req, res 객체

req, res 객체는 프론트의 요청, 응답을 처리하기 위해 꼭 필요한 객체이다. 그러므로 반드시 알아두어야 한다. req, res 객체에 어떠한 속성이 있는지, 그들은 어떠한 정보를 갖고 있는지 살펴보자.

### req.app

req객체의 app 속성으로 app 객체에 접근할 수 있다.<br/>
예를 들어, app.js 에서 app.set(키, 값)으로 설정해 둔 값을 req.app.get(키) 로 가져올 수 있다.

### req.body

body-parser 미들웨어 혹은 express에 내장된 미들웨어가 프론트 요청을 파싱한 내용이 담겨있다.

### req.cookies

cookie-parser 미들웨어가 프론트 요청 중 쿠키에 대한 내용을 파싱한 내용이 담겨있다.

### req.ip

요청한 클라이언트의 아이피 주소가 담겨있다.

### req.params

주소에 경로 파라미터가 존재하면, 그 내용을 객체로 만든 값이 담겨있다. 

### req.query

주소에 쿼리 파라미터가 존재하면, 그 내용을 객체로 만든 값이 담겨있다.

### req.signedCookies

서명한 쿠키를 생성했다면 cookie-parser에 의해 파싱된 내용이 req.cookies가 아닌 req.signedCookies에 담기게 된다. 

### req.get(헤더 이름)

요청 헤더의 값을 조회할 수 있다.

<br/><br/>

### res.app

res 객체로도 app 객체에 접근할 수 있다.

### res.cookie(키, 값, 옵션)

클라이언트에 전달할 쿠키를 설정한다.

### res.clearCookie(키, 값, 옵션)

해당 클라이언트의 특정 쿠키를 제거한다. 키, 값, 옵션이 정확히 일치하는 쿠키만 제거된다.

### res.end()

데이터 없이 응답을 보낸다.

### res.json(JSON)

json 형식의 응답을 보낸다.

### res.redirect(주소)

클라이언트가 인자로 전달한 주소로 리다이렉션하게 한다.

### res.render(뷰, 데이터)

인자로 전달한 view를 렌더링하여 클라이언트에게 전달한다. view를 렌더링할 때 필요한 데이터를 두 번째 인자로 전달해줄 수 있다.

### res.send(데이터)

데이터와 함께 응답을 보낸다. 데이터는 문자열, HTML파일, 버퍼, 객체, 배열 등 어떠한 형태든 될 수 있다.

### res.sendFile(경로)

인자로 전달된 경로의 정적 파일을 사용자에게 전달한다.

### res.set(헤더, 값)

응답 헤더를 설정한다.

### res.status(코드)

응답 상태 코드를 설정한다.