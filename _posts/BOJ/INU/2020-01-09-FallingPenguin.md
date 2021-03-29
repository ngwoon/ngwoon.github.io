---
title: 펭귄추락대책위원회
author: ngwoon
layout: post
categories:
- BOJ
tags:
- 펭귄추락대책위원회
- 백준
- INU
- bfs
- 18228
---

# [백준] 18228번 - 펭귄추락대책위원회
- - -

[문제 링크](https://www.acmicpc.net/problem/18228)

문제에서 포인트로 잡고 있는 부분은 2가지이다.

- **펭귄은 1번째 혹은 N번째에 위치할 수 없다.**
- **얼음 그룹에 1번째 혹은 N번째 얼음이 존재하면 무너지지 않는다.**

첫 번째 포인트를 통해 펭귄을 기준으로 왼쪽, 오른쪽 얼음 그룹으로 나뉠 수 있음을 알 수 있고, 두 번째 조건을 통해 왼쪽, 오른쪽 얼음 그룹에서 각각 하나의 얼음을 부수면 펭귄은 반드시 떨어짐을 알 수 있다.

즉, 이 문제는 펭귄 위치를 기준으로 왼쪽, 오른쪽 얼음 그룹에서 각각 강도가 가장 약한 하나의 얼음을 찾아내는 문제이다.

```cpp
#include <iostream>

using namespace std;

int power[200000];  // 얼음 강도
int ppos;           // 펭귄의 위치

int main(void) {
    int N;

    cin >> N;

    for(int i=0; i<N; i++) {
        cin >> power[i];

        if(power[i] == -1)
            ppos = i;
    }

    // 펭귄의 왼쪽에서 가장 낮은 강도의 얼음 찾기
    int minPow = 1000000000;
    int result = 0;
    for(int i=0; i<ppos; i++) {
        if(minPow > power[i])
            minPow = power[i];
    }

    result += minPow;

    // 펭귄의 오른쪽에서 가장 낮은 강도의 얼음 찾기
    minPow = 1000000000;
    for(int i=ppos + 1; i<N; i++) {
        if(minPow > power[i])
            minPow = power[i];
    }

    result += minPow;

    cout << result;

    return 0;
}
```

**문제를 풀 때 큰 수를 저장할 경우 오버플로우 문제를 항상 주의하자.**

이 문제는 해당되지 않지만, 백준 문제를 풀다 보면 심심치 않게 오버플로우로 인해 틀리고는 한다.
