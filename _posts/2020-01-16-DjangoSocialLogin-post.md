---
title: Django 소셜 로그인 사용하기
author: ngwoon
layout: post
categories:
- Django
tags:
- 소셜 로그인
- 구글
- 장고
- Django
---

# [Django] 소셜 로그인 적용
- - -

요즘엔 로그인 기능을 사용하지 않는 사이트를 찾아보기 힘들다. 필자 또한 웹을 공부하면서 가장 기본이 되는 로그인 기능과 마주하게 되었다. 그냥 구현해 보는 것도 좋은 공부가 되겠지만, 사용 가능한 API 활용을 얼마나 잘 하는가도 중요하다고 생각한다. 따라서 현 포스트에선 Django에 소셜 로그인 기능을 어떻게 추가하는지를 살펴보고자 한다.

  <h6>
  아래 내용은 구글 소셜 로그인을 django에서 사용하는 방법에 대한 내용입니다.
  <br>
  django설치, 프로젝트/앱 시작, 첫 migration, 관리자 계정 만들기 등 기본적인 설정은 완료되었다고 가정하고 그 이후의 내용을 다룹니다.
  <br>
  아울러 이 포스트는 PyCharm + Django 환경에서 공부한 내용을 토대로 작성되었음을 알립니다.
  </h6>

  <br><br>

  <h3> I. django-allauth 라이브러리 설치 및 설정 </h3>  
  위 라이브러리는 소셜 로그인 기능을 django에서 사용 가능하게 도와준다.
  설치 후 몇 가지 설정만 해준다면 자신의 프로젝트에 소셜 로그인 기능을 넣을 수 있다.
  <br>

  <h3> II. settings.py 설정 </h3>

  자신의 웹 앱과 django-allauth를 연결해주는 작업이라고 생각하면 될 것 같다.

  ![settings.py1](/assets/images/Django-Social-LogIn-post-images/settings1.png)

  위 이미지의 provider부분은 어떤 공급체(google, facebook 등)의 소셜 로그인을 사용할 것인지를 의미한다.

  <br>

  settings.py 맨 밑에 아래 내용을 추가해 준다.

  ![settings.py2](/assets/images/Django-Social-LogIn-post-images/settings2.png)

  위 이미지의 LOGIN_REDIRECT_URL 은 사용자의 로그인 후 보여질 페이지를 의미한다. 자신의 웹에 맞게 잘 설정해주자.

  <br><br>

  <h3> III. urls.py 설정 </h3>

  urls.py 는 웹에서 표현되는 url과 웹 프로젝트의 파일 사이의 관계를 명시하는 역할을 맡는다. allauth 라이브러리에 소셜 로그인에 대한 urls.py가 이미 정의되어 있으므로, 로그인 시도가 요청되면 allauth의 urls.py로 이동할 수 있도록 설정해주자.

  ```python
  #MyProject/urls.py
  from django.contrib import admin
  from django.urls import path, include

  urlpatterns = [
      path('admin/', admin.site.urls),
      path('accounts/', include('allauth.urls')),
  ]
  ```

  위 과정을 마쳤으면, ```python manage.py migrate``` 를 입력해 변경사항을 적용한다.

  여기까지의 내용이 잘 적용 되었는지 확인해보고 싶다면, 서버를 돌려 관리자 페이지로 들어가보자.

  터미널에 ```python manage.py runserver``` 입력 후 http://127.0.0.1:8000/admin 으로 접속하면 아래와 같은 화면을 마주할 것이다.

  ![CheckAdminPage](/assets/images/Django-Social-LogIn-post-images/CheckAdminPage.png)
  <h6> (JOIN 항목은 필자가 django DB를 공부하며 추가했던 내용이므로 무시해도 된다.) </h6>

  <br>

  위 화면이 정상적으로 뜨면, SITES -> ADD SITE 클릭 후 도메인 이름과 display 이름에 127.0.0.1:8000 기입 후 저장한다.

  다시 Home으로 돌아와 Social Accounts -> Social applications -> ADD SOCIAL APPLICATION으로 이동한다.

  Provider을 Google로, Name은 자신이 원하는 이름을 적으면 된다.
  여기서 중요한 부분은 Client id와 Secret Key 항목이다. 이 부분을 Google Sign-In API 등록후 받는 key로 채우면 된다.
  웹 사이트 설정은 여기서 잠시 멈추고, Google Sign-In API 키 발급을 받으러 가보자.

  <br><br>

  ---
  <h3> Google Sign-In API 키 발급 </h3>

  대부분의 API를 사용하기 위해서는 해당 API의 키 발급을 받아야 한다. 우선 아래 링크로 접속하자.

  [Google API Console 링크](http://console.developers.google.com/)

  Google API를 사용하기 위해선 프로젝트가 있어야 한다. 우선 프로젝트를 하나 만들자. (새 프로젝트 만들기 -> 프로젝트 이름 작성 -> 프로젝트 생성)

  이후 왼쪽 목차의 "사용자 인증 정보" 항목 클릭 -> 사용자 인증 정보 만들기 -> OAuth 클라이언트 ID -> 동의 화면 구성 -> 애플리케이션 이름 작성 -> 저장

  다시 "사용자 인증 정보" 항목 -> "사용자 인증 정보 만들기" 를 클릭하면 애플리케이션 유형을 선택하는 화면이 나온다. 이 중 "웹 애플리케이션" 을 선택한다.

  애플리케이션 이름은 원하는 대로 적고, 아래 url을 기입하는 2가지 항목에 http://127.0.0.1:8000을 입력하고 "생성" 버튼을 누르면 **클라이언트 ID** 와 **클라이언트 보안 비밀 코드** 가 나타난다.

  ---

  <br><br>

  이제 다시 나의 웹 사이트 설정 페이지로 돌아가서, Client id 항목과 Secret key 항목에 차례로 방금 전 얻은 코드를 입력한다.
  마지막으로 아래 Sites에 http://127.0.0.1:8000을 Chosen sites 목록으로 옮겨주면 django와 구글 소셜 로그인 연동이 완료된다.

  <br>

  이제 index.html을 작성하여 구글 로그인 기능이 잘 작동되나 확인해보자.

  <br>

  **서버 가동 후 웹 사이트 확인**
  ![NeedLogIn](/assets/images/Django-Social-LogIn-post-images/NeedLogin.png)
  <br>
  ![LogIned](/assets/images/Django-Social-LogIn-post-images/Logined.png)


  회원가입 기능도 잘 된다. 눈으로 확인해보고 싶다면, 회원가입 후 관리자 페이지로 접속하여 아이디가 추가 되었는지 확인할 수 있다.  


  <br><br>


  ***Redirect_Error 발생 시***

  에러 메세지를 잘 읽어보면 http://127.0.0.1:8000/accounts/google/login/callback/ 에 연결되지 못하고 있다는 에러임을 알 수 있다.
  이 경우 Google API Console 페이지로 접속하여 "사용자 인증 정보" 로 들어가 방금 만든 웹 애플리케이션을 클릭한다. 이후 "승인된 리디렉션 URL" 항목에 위 url을 추가해주면 에러가 해결된다.
