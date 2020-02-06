---
title: 파괴된 도시
author: ngwoon
layout: post
categories:
- boj
tags:
- 파괴된 도시
- 백준
- INU
- 18231
---

# [백준] 18231번 - 파괴된 도시
- - -

[문제 링크](https://www.acmicpc.net/problem/18231)

한 도시가 폭격당하면 인접한 모든 도시가 파괴된다. 즉, 인접한 도시 중 파괴되지 않은 도시가 하나라도 있으면, 해당 도시는 폭격당하면 안된다.

문제의 조건이 폭격당하는 최소 도시 갯수가 아닌, 여러 경우가 정답이 될 수 있으므로 필자는 최대한 쉬운 방향으로 구현했다.

구현 내용 중 핵심은 아래와 같다.  

* ##### answer 벡터에 오름차순으로 도시를 넣기 위해, binary_search STL을 이용하기 위해서 destroied 벡터를 미리 오름차순으로 정렬한다.
* ##### solve 함수 내에서 adj 배열을 순회하며 해당 도시의 인접 도시가 모두 파괴된 상태라면, 해당 도시와 인접한 도시를 check 배열에 파괴되었다고 표시한다.
* ##### destroied 배열 내의 모든 도시가 파괴되었으면 solve 함수를 return 한다.

```cpp
#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

vector<int> adj[2001];
vector<int> destroied;
vector<int> answer;
bool checked[2001];

void solve(int dcSize) {

    for(int i=0; i<dcSize; i++) {
        int cur = destroied[i];
        int j;
        for(j=0; j<adj[cur].size(); j++) {
            if(!binary_search(destroied.begin(), destroied.end(), adj[cur][j]))
              break;
        }

        // 자기 자신과 인접한 모든 도시가 파괴된 상태라면
        if(j == adj[cur].size()) {
            answer.push_back(cur);
            checked[cur] = true;
            for(j=0; j<adj[cur].size(); j++)
                checked[adj[cur][j]] = true;
        }

        // 지도와 현재 파괴된 도시와 같은지 검사
        for(j=0; j<dcSize; j++) {
            if(!checked[destroied[j]])
                break;
        }

        // 현재까지의 폭격으로 지도와 같은 상황이 완성되었다면 return
        if(j == dcSize)
            return;
    }
}

int main(void) {

    cin.sync_with_stdio(false);
    cin.tie(NULL); cout.tie(NULL);

    int cSize, rSize;

    cin >> cSize >> rSize;

    for(int i=0; i<rSize; i++) {
        int v1, v2;

        cin >> v1 >> v2;

        adj[v1].push_back(v2);
        adj[v2].push_back(v1);
    }

    int dcSize; //destroied city size

    cin >> dcSize;

    for(int i=0; i<dcSize; i++) {
        int temp;
        cin >> temp;
        destroied.push_back(temp);
    }

    sort(destroied.begin(), destroied.end());

    solve(dcSize);

    // 정답 확인
    int aSize = answer.size();
    int i;
    for(i=0; i<destroied.size(); i++) {
        if(!checked[destroied[i]])
            break;
    }
    if(i != destroied.size())
        cout << -1;
    else {
        cout << aSize << endl;
        for(int i=0; i<aSize; i++)
            cout << answer[i] << " ";
    }
}

```
