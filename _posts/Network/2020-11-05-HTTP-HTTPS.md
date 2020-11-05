---
title: HTTPS
author: ngwoon
layout: post
categories:
- Network
tags:
- HTTP
- Network
- HTTPS
- SSL
- TLS
- 대칭키
- 비대칭키
- handshake
---

# [Network] HTTPS
- - -

HTTP는 서버와 클라이언트 사이 송,수신되는 데이터가 텍스트 기반이기 때문에 보안이 취약하다는 단점이 존재한다. IT 기술이 발전하면서 개인의 아이디, 패스워드, 결제정보 등 민감한 정보의 교환이 급증하였고, 개인정보 유출 위험성도 동시에 높아졌다.<br/>
취약한 보안을 보완하기 위해 HTTPS 가 등장했다. HTTPS의 주 목적은 서버, 클라이언트 사이를 이동하는 **패킷의 암호화**이다. 이를 위해 HTTPS는 TCP layer 위에 SSL/TLS layer가 추가적으로 존재한다.

# SSL (Secure Socket Layer), TLS (Transport Layer Security)

Netscape 사에서 개발한 인터넷 통신 보안 프로토콜이며, 총 3개의 버전이 출시되었다.<br/>
SSL 1.0은 공개되지 않았으며, 2.0이 공개된 후 발견된 여러 결함들을 보완하여 SSL 3.0이 발표되었다. 이는 TLS의 초석이 되었다.<br/>
TLS는 SSL이 IETF(Internet Engineering Task Force)에 의해 표준화되면서 바뀐 이름이다. 즉, SSL 3.0과 극적인 차이가 없으며 SSL과 TLS는 함께 묶여 SSL/TLS 프로토콜로 불린다. 현재 HTTPS로 암호화 통신을 지원하는 거의 대부분의 웹사이트들에는 TLS가 사용되고 있다. 허나 아직도 "SSL 증명서" 와 같이 SSL이란 단어가 자주 쓰이는 것을 보면, TLS를 SSL의 최신 버전을 부르는 명칭 쯤으로 받아들이면 될 것 같다. 이 포스트에선 편의상 SSL/TLS를 SSL로 표기한다.

SSL은 크게 **one-way SSL**과 **two-way SSL**로 나눌 수 있다.  one-way SSL은 주로 클라이언트-서버 관계에서 사용되며, 클라이언트만 서버가 유효한 서버인지 검증한다.  two-way SSL은 주로 서버-서버 관계에서 사용되며 상호가 유효한 대상인지 검사한다.<br/>
이 포스트에선 one-way SSL 의 연결 과정을 살펴볼 것이다.

아래 내용의 이해를 돕기 위해 대칭키 (symmetric key) 와 비대칭키(asymmetric key) 시스템을 간단히 짚고 넘어가자.<br/>
대칭키는 상대와 내가 동일한 key를 이용하여 데이터를 암호화하는 방법이고, 비대칭키는 상대와 내가 서로 다른 key를 이용하여 데이터를 암호화하는 방법이다.<br/>
대칭키 방식은 암호화, 복호화에 필요한 비용이 적고, 빠르다는 장점이 있지만, 그만큼 파훼될 가능성이 있으며 각 상대에게 대칭키를 전달할 때 키가 노출될 수 있는 **키 분배 문제**가 존재한다. <br/>
비대칭키 방식은 정수론과 같은 매우 어렵고 복잡한 수학 개념을 사용하여 만든 암호 알고리즘을 사용한다. 그만큼 보안성이 좋지만, 암호화, 복호화에 필요한 비용이 크다.<br/>
SSL은 대칭키의 키 분배 문제를 해결하면서 암호화, 복호화에 필요한 비용을 줄이기 위해 **handshaking 시에만 비대칭키 방법을 사용하고, 이를 통해 대칭키를 만들어 이후 통신에 사용하는** 효율적인 전략을 갖추었다.
<br/><br/><br/>

## Standard SSL Handshake

SSL 연결을 위해 TCP와 마찬가지로 handshaking 과정이 필요하다. 그 전에, **SSL 연결은 TCP 연결이 완료되어야 시작될 수 있다.** 이 점 인지하고 SSL의 handshake 과정을 살펴보자.<br/>
참고로 SSL 연결에 사용되는 키 교환 알고리즘으로 ECC, RSA, DSA 등이 존재한다. 아래 과정은 RSA를 사용한 SSL 연결 과정이다.

### 1. **Client Hello**

클라이언트가 HTTPS 통신을 지원하는 서버에게 SSL 연결을 요청한다.<br/>
**이 때 클라이언트에서 지원 가능한 SSL version, 암호 설정, session-specific 정보를 보낸다.**

### 2. **Server Hello**

**클라이언트로부터 받은 정보를 토대로 서버에서 이 클라이언트와 통신할 때 사용할 SSL version, 암호 설정, session-specific을 선택한다.** 만약 클라이언트가 제시한 각 항목의 후보군 중 서버에서 어느 항목의 모든 후보를 지원할 수 없다면, 연결은 실패한다.<br/>
지원 가능한 후보를 선택한 후, 서버는 **인증서 (Certificate) 를 함께 클라이언트에게 보낸다.** 이는 [신뢰할 수 있는 기관](https://www.checktls.com/showcas.html)에서 발급하는 인증서로, **서버가 public key의 소유주임을 증명하고 해당 서버가 안전한 서버임을 증명하는 수단이 된다.**<br/>
이후 서버는 **ServerHelloDone 메세지를 보내며 ServerHello 메세지의 끝**을 알린다.

### 3. **Authentication and Pre-Master Secret**

클라이언트는 서버가 제공한 인증서를 검증한다. 유효한 서버임이 검증되면, 서버와 클라이언트가 의논 하에 결정한 **암호 설정에 기반하여 pre-master secret을 생성**한다. 그리고 서버에서 제공한 public key를 이용하여 pre-master secret을 암호화한 뒤 서버에게 전송한다.

### 4. **Decryption and Master Secret**

서버는 클라이언트가 public key로 암호화한 내용을 복호화할 수 있는 **private key**를 갖고 있다. 이를 이용하여 클라이언트로부터 전달받은 pre-master secret을 복호화한다.<br/>
이제 서버와 클라이언트가 동일한 pre-master secret을 소유하고 있는 상태이다. **사전에 결정된 암호 설정에 기반하여 pre-master secret을 이용해 master secret을 생성**한다.

### 5. **Encryption with Session Key**

4번 과정에서 생성된 **master secret을 이용하여 서버와 클라이언트는 데이터를 암호화한다.**<br/>
서버와 클라이언트는 **서로에게 finish 메세지를 보내어** 이후 전송될 데이터는 모두 암호화하여 전송할 것을 알린다.

![tls-ssl-handshake](/assets/images/post/Network/HTTP-HTTPS/tls-ssl-handshake.png)
<em>
    이미지 출처 : [https://www.cloudflare.com/ko-kr/learning/ssl/why-use-https/](https://www.cloudflare.com/ko-kr/learning/ssl/why-use-https/)
</em>

---

# HTTPS와 HTTP 차이

HTTP와 HTTPS 는 송,수신되는 데이터가 암호화된다는 점 외에는 큰 차이가 없다. 

[Cloudflare 문서](https://www.cloudflare.com/ko-kr/learning/ssl/why-use-https/)에서는 HTTP보다 HTTPS를 사용해야하는 이유에 대해 설명하고 있다. 대강 요약하면 HTTPS를 사용하는게 서버와 클라이언트 모두에게 더 안전한 방법이며, "HTTPS 사용 시 HTTP를 사용할 때보다 페이지 로딩 속도가 느려진다" 와 같은 몇 가지 속설에 대해 반박하는 내용이 담겨 있다.

HTTPS를 공부하면서 한 가지 흥미로운 점이 있었는데, google에서 HTTPS 사용을 독려한다는 내용이다. 구글링하며 HTTPS에 관한 여러 블로그 및 문서를 읽다보니 HTTPS를 사용하는 웹 사이트는 더 신뢰성 있는 사이트로 판별되어 google 검색 노출 우선순위가 높아진다는 내용이 자주 등장했다. 

이번 주제를 공부하면서 [Cloudflare 문서](https://www.cloudflare.com/ko-kr/learning/ssl/why-use-https/)를 처음 알게 되었는데, UI가 깔끔하여 가독성도 좋고 네트워크 보안 및 클라우드와 관련된 내용을 살펴보기에 괜찮은 문서인 것 같다.

---

# 참고문헌

[https://www.cloudflare.com/ko-kr/learning/ssl/what-happens-in-a-tls-handshake/](https://www.cloudflare.com/ko-kr/learning/ssl/what-happens-in-a-tls-handshake/)

[https://www.cloudflare.com/ko-kr/learning/ssl/why-use-https/](https://www.cloudflare.com/ko-kr/learning/ssl/why-use-https/)

[https://medium.com/@kasunpdh/ssl-handshake-explained-4dabb87cdce](https://medium.com/@kasunpdh/ssl-handshake-explained-4dabb87cdce)

[https://www.websecurity.digicert.com/security-topics/how-does-ssl-handshake-work](https://www.websecurity.digicert.com/security-topics/how-does-ssl-handshake-work)