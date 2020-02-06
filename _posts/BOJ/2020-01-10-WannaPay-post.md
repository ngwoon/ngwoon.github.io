---
title: 내가 살게, 아냐 내가 살게
author: ngwoon
layout: post
categories:
- boj
tags:
- 내가 살게, 아냐 내가 살게
- 2019 INU
- 18229
---

# [백준] 18229번 - 내가 살게, 아냐 내가 살게
- - -

[문제 링크](https://www.acmicpc.net/problem/18229)

굉장히 간단한 문제이다.

1번 사람부터 N번 사람까지 순서대로 손 길이를 늘려가며 처음으로 K를 넘은 사람을 골라낸다.

```cpp
#include <iostream>

using namespace std;

int N, M, K;

int len[100][100];

int check[100] = {0};

int main(void) {
    cin >> N >> M >> K;

    for(int i=0; i<N; i++) {
        for(int j=0; j<M; j++)
            cin >> len[i][j];
    }

    int turn = 0;
    while(1) {
        for(int i=0; i<N; i++) {
            check[i] += len[i][turn];
            if(check[i] >= K) {
                cout << i + 1 << " " << turn + 1;
                exit(0);
            }
        }
        ++turn;
    }
}

```
