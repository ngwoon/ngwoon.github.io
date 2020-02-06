---
title: 좋은 수열
author: ngwoon
layout: post
categories:
- boj
tags:
- 좋은 수열
- 백준
- 백트래킹
- backtracking
- 2661
---

# [백준] 2661번 - 좋은 수열
- - -

[문제 링크](https://www.acmicpc.net/problem/2661)

좋은 수열이란, 동일한 부분수열이 연속적으로 나오지 않은 수열을 의미한다.

언뜻 봐선 백트래킹을 이용하면 간단히 풀릴듯한 문제이고, 실제로 백트래킹을 사용하면 답은 잘 나온다. 그러나 채점 결과 시간초과 문제에 부딪혔고, 그 원인을 찾기까지 꽤 시간이 걸렸다.

우선 필자가 처음 구상한 방법은 아래와 같다.

#### - 기본적으로 백트래킹 기법을 사용한다. 이 문제의 경우 '1' ~ '3'을 순차적으로 방문하기 때문에 방문 배열은 따로 사용하지 않는다.
#### - dfs함수는 추가할 수를 인자로 받아 문자열에 이어 붙인다.
#### - 문자열의 길이가 N과 같으면, 정답 문자열과 비교하여 작은 것을 정답 문자열로 갱신한다.
#### - 문자열의 길이가 N과 같지 않으면, 다음에 올 수 있는 수를 탐색한다. 이 때 필요한 유망성 검사는 2가지이다.
##### &nbsp;&nbsp;&nbsp;&nbsp; 1. 가장 최근에 붙여진 수와 같은 수가 붙으면 나쁜 수열이 되므로 제외한다.
##### &nbsp;&nbsp;&nbsp;&nbsp; 2. 끝에서부터 짝수개의 수가 서로 동일한지 검사한다.
![VerifyOdd](/assets/images/post/boj/GoodSequence/GoodSeq_explainOdd.png)
![VerifyEven](/assets/images/post/boj/GoodSequence/GoodSeq_explainEven.png)

<br>
&nbsp;위와 같이 코딩한 후 채점해보니 시간 초과가 떴다. 실제로 N을 30, 40으로 설정하니 10초가 넘어가도 결과가 나오지 않는 것을 확인했다. 무엇이 문제일까 열심히 고민하니, 답은 생각보다 허무한 곳에 있었다.  
#
&nbsp;문제에서 요구한 건 가장 작은 수열이고, 실제로 가장 작은 1부터 탐색하기 때문에, 첫 번째로 발견한 길이 N의 좋은 수열이 곧 답이 된다. 따라서 그 즉시 수열을 출력하고 알고리즘을 종료하면 시간 초과 문제가 해결된다.

```cpp
#include <stdio.h>
#include <stdlib.h>
#include <string>

/*
    백트래킹
    백준 2661 - 좋은수열

    <기존 백트래킹 문제와의 차이점>
    참인 모든 결과를 살펴야 할 필요가 없었다.
    가장 작은 수열을 찾아야 했고, 탐색을 작은 수부터 차례로 진행하기 때문에 조건에 부합하는 결과를 찾으면
    바로 출력하고 종료하면 되었던 문제
*/

using namespace std;

string stk;
int N;

void dfs(char cur) {
    stk += cur;

    // 정답 변수와 현재 수열의 비교
    if(stk.size() == N) {
        printf("%s", stk.c_str());
        exit(0);
    }

    for(char c='1'; c<='3'; c++) {
        // 다음 수를 넣었을 때 나쁜 수열인지 확인 필요 (유망성 검사)
        if(c == stk.back()) continue; // 바로 전 숫자와 같으면 유망하지 않음

        string nsq = stk; // next sequence
        nsq += c;

        bool isBad = false;
        for(int i=1; i<=nsq.size()/2; i++) {
            string comp = nsq.substr(nsq.size() - i);
            string target = nsq.substr(nsq.size() - i*2, i);

            // 나쁜 수열이면 isBad = true
            if(!comp.compare(target)) { isBad = true; break; }
        }
        if(isBad) continue;

        dfs(c);
    }
    stk.erase(stk.end() - 1);
}

int main(void ) {
    scanf("%d", &N);

    dfs('1');
}
```
