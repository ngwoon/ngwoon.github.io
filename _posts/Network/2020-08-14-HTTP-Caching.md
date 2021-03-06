---
title: HTTP 캐싱
author: ngwoon
layout: post
categories:
- Network
tags:
- HTTP
- Network
- Caching
- 캐시
---

# [Network] HTTP 캐싱
- - -

본 내용은 [MDN HTTP 캐싱](https://developer.mozilla.org/ko/docs/Web/HTTP/Caching)를 보고 공부, 정리한 내용입니다.<br/>

## 웹 캐싱의 역할

클라이언트 요청 시, 이전에 서버로부터 전달받은 리소스에 대한 요청이라면 해당 요청을 가로채 캐시 서버가 클라이언트에게 리소스를 전달한다.
<br/>

## 웹 캐싱 효과

1. 서버 과부하 해소
2. 클라이언트 페이지 로드 빨라짐
<br/>

## 웹 캐싱 종류

1. 공유 프록시 캐시(공유 캐싱)<br/>
    ![공유 프록시 캐시](/assets/images/post/Network/HTTP-Caching/sharing-proxy-caching.png)<br/>
    해당 웹 서버를 이용하는 한 명 이상의 사용자에 의해 재사용되는 응답을 저장하는 캐시이다.<br/>
    웹 프록시 서버에서 자주 요청되는 리소스들을 저장해두어 클라이언트에게 응답한다.<br/>
    대표적인 공유 프록시 캐시는 CDN (Content Delivery Network) 이다.<br/>
2. 사설 브라우저 캐시(로컬 캐싱)<br/>
    ![사설 브라우저 캐시](/assets/images/post/Network/HTTP-Caching/browser-caching.png)<br/>
    브라우저 설정의 "캐시" 설정과 관련된 캐시이다. 브라우저 캐시는 사용자가 HTTP를 통해 서버로부터 받은 모든 문서를 갖고 있다. 이 데이터를 이용해 뒤로가기, 앞으로 가기, 저장, 소스 보기 등의 기능을 제공한다.<br/>
<br/>

## 브라우저 캐싱 방법
HTTP/1.1 헤더에 캐싱 동작과 관련된 설정을 할 수 있다. 이 포스트에서는 헤더의 내용 중 캐시와 관련된 내용을 살펴보자. 주로 사용되는 HTTP Response header로는 Cache-Control 이 있다.<br/>
Cache-Control 헤더는 서버측에서 클라이언트측에 보내는 HTTP 헤더로, 해당 내용을 캐싱할 수 있는 사용자, 해당 조건 및 기간을 알려주는 역할을 한다.<br/>
(서버 → 클라이언트로 해당 내용을 캐싱 시 어떤 정책으로 해야하는지를 알려주는 메세지)<br/>
HTTP Request Header에 Cache-Control 헤더를 사용할 수도 있다. 이 때는 보통 웹 브라우저 - 프록시  - 서버 와 같은 형태일 때, 클라이언트가 본 서버에서 직접 리소스를 가져오길 원하면 HTTP Request Header 중 Cache-Control 헤더에 해당 내용을 넣어 요청해야 한다.<br/>

> 이 내용을 공부할 땐 브라우저의 개발자 도구를 통해 각 헤더가 어떤 모습인지 직접 확인하기를 추천한다.<br/>
> 개발자 도구 (F12) -> Network 탭 -> 현재 html 파일을 더블클릭하면 Request/Response 헤더를 확인할 수 있다.
<br/>

## Cache-Control 속성
- max-age<br/>
    "max-age = 120" 형태로 주어지는 이 속성은, 클라이언트가 제공받은 리소스를 캐싱해둘 유효기간 (초 단위) 을 의미한다. 위 예시는 해당 내용을 120초 동안 캐싱해두는 것을 허가한다는 의미이다.
- no-cache<br/>
    이 속성은 클라이언트의 리소스 캐싱을 허용하되, 캐싱된 리소스를 사용하기 전 서버에 검증 요청을 해야한다는 의미이다.
- no-store<br/>
    이 속성은 클라이언트의 캐싱을 허용하지 않고, 매 요청 시 서버에서 리소스를 다운받아야 함을 의미한다.
- public<br/>
    이 속성은 클라이언트가 어디서 리소스를 받던 해당 내용을 캐싱함을 허용한다는 의미이다.
- private<br/>
    이 속성은 클라이언트의 캐싱을 허용하되, 반드시 본 서버에서 받은 리소스를 캐싱해야함을 의미한다. 즉, CDN과 같은 곳에서 받은 리소스는 캐싱할 수 없다.<br/>
<br/>

## Cache-Control 이외에 캐싱과 관련된 HTTP 헤더
- expires<br/>
    해당 캐시가 언제 만료되는지를 나타낸다. Cache-Control 헤더 속성에 max-age가 명시되어 있다면 무시된다.
- ETag<br/>
    리소스의 버전을 나타내는 토큰(문자열) 이다. 만약 본 서버의 해당 리소스 내용이 바뀌었다면 토큰이 달라지고, 이 때 브라우저는 본 서버에서 변경되거나 추가된 리소스를 다운받아야 한다.<br/>
    (변경되지 않은 리소스는 재다운로드하지 않는다.)<br/>
    ETag의 내용이 달라지지 않았다면 응답코드 304(Not Modified) 가 수신되며, 이 때는 캐싱된 리소스를 그대로 사용한다.
- vary<br/>
    HTTP Request 헤더에는 해당 브라우저에 최적화된 encoding, language등의 내용이 포함되어 있다.<br/>
    ![HTTP_Request_header](/assets/images/post/Network/HTTP-Caching/http-request-header.png)<br/>
     - [https://www.imperva.com/learn/performance/cache-control/](https://www.imperva.com/learn/performance/cache-control/)

    <br/>
    vary 헤더는 HTTP Response 헤더에 포함되어 있다. 아래 예시로 이 헤더의 역할을 살펴보자.<br/>
    만약 어느 클라이언트의 HTTP Request 헤더의 accept-encoding 속성이 deflate이고, 캐싱 서버에 저장된 리소스가 vary: accept-encoding 정책에 의해 저장되었다고 가정하자. 이 리소스가 gzip 포맷이라면 클라이언트가 원하는 deflate 포맷과 다르므로 클라이언트 요청은 본 서버로 넘어가야 하며, 이 때 캐싱 서버가 이를 판단한다.<br/>
    즉 vary 헤더는 캐싱된 리소스가 클라이언트에게 제공될 때 만족시켜야 할 조건을 의미한다. 클라이언트의 요청과 캐싱된 리소스의 vary 정책이 알맞다면 캐싱 리소스를 클라이언트에게 제공하고, 그렇지 않다면 캐싱 서버가 본 서버에 해당 요청을 전달하게 된다.<br/>
    vary 헤더를 사용하는 가장 대표적인 예시는 모바일 기기에서 캐싱 서버에 접근하여 리소스를 받을 때, 데스크탑 형식의 리소스를 받는 경우를 방지하는 상황이다.