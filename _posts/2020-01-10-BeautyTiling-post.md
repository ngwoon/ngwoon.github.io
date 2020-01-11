---
title: 2 x N 예쁜 타일링
author: ngwoon
layout: post
categories:
- BOJ
tags:
- 2 x N 예쁜 타일링
- 2019 INU
- 18230
---

# [BOJ] 18230번 - 2 x N 예쁜 타일링
- - -

[문제 링크](https://www.acmicpc.net/problem/18230)

특별한 알고리즘이 필요하다기 보단, 문제에 대한 풀이방식을 코드로 옮기는 구현력이 필요한 문제이다.

필자가 문제를 해결하기 위해 사전에 구상한 내용은 아래와 같다.  
#

1. ### 2x1 타일과 2x2 타일의 예쁨 정도를 내림차순으로 정렬한다.
2. ### 가능한 한 많은 2x2 타일로 정보대 화장실의 타일을 채운다. 남는 부분이 있다면 2x1 타일로 채운다.

    - #### 위 과정을 끝내면, 2x2타일들 중 예쁨 정도가 높은 타일들은 정보대 화장실 타일에 채워져 있다.
    - #### 단, 2x1 타일 2개를 합쳐서 2x2 타일 하나보다 높아질 수도 있으므로 이에 대한 검사가 필요하다.

3. ### 2x2 타일들 중 예쁨 정도가 낮은 타일부터, 2x1 타일 2개의 예쁨 정도와 비교한다.
    - #### 3번을 반복 수행하다가 2x2 타일이 2x1 타일 2개보다 높은 경우, 검사를 멈추고 정답을 출력한다.  

#

이 문제는 정답이 여러 개 존재할 수 있는 스페셜 저지 문제이므로, 다양한 풀이법이 나올 수 있다. 아래 코드를 참고하여 더 좋은 풀이를 만들어 내길 바란다.


```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

vector<int> small;  // 2x1 타일
vector<int> big;    // 2x2 타일
vector<int> tiles;  // 정답 벡터

int main(void) {
    int N, A, B;

    cin >> N >> A >> B;

    for(int i=0; i<A; i++) {
        int temp;
        cin >> temp;
        small.push_back(temp);
    }
    for(int i=0; i<B; i++) {
        int temp;
        cin >> temp;
        big.push_back(temp);
    }

    // 예쁨 정도를 내림차순으로 정렬
    sort(big.begin(), big.end(), greater<int>());
    sort(small.begin(), small.end(), greater<int>());

    int res = N - (B << 1);

    int cIndex; // small 배열의 사용하지 않은 타일 위치 저장
    int bIndex; // tiles배열 내에서 big tile이 사용된 가장 높은 인덱스 저장

    if(res > 0) {
        for(int i=0; i<big.size(); i++)
            tiles.push_back(big[i]);

        for(int i=0; i<res; i++)
            tiles.push_back(small[i]);

        cIndex = res;
        bIndex = big.size() - 1;
    } else {

        int temp = N;

        int i=0;
        while(temp > 1) {
            tiles.push_back(big[i++]);
            temp -= 2;
        }

        bIndex = i - 1;

        if(temp > 0) {
            tiles.push_back(small[0]);

            cIndex = 1;
        } else
            cIndex = 0;
    }

    // 2x2 타일 하나와 2x1 타일 2개의 예쁨 정도 비교
    for(int i=bIndex; i>=0; i--) {
        if(tiles[i] < small[cIndex] + small[cIndex + 1]) {
            tiles[i] = small[cIndex] + small[cIndex + 1];
            cIndex += 2;

            if(cIndex > small.size() - 2)
                break;
        } else
            break;
    }

    int sum = 0;
    for(int i=0; i<tiles.size(); i++)
        sum += tiles[i];

    cout << sum;

    return 0;
}  
```
