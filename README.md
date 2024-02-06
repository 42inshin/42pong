# 42pong
## 프로젝트 설명

`개요`

- socket.io를 이용한 실시간 게임
- 공개, 비공개 채팅(채널 / DM)
- 친구 관리
- 권한에 따른 채팅금지, 벤 기능

`참여 인원`

- 팀원: 4명 (FE 2, BE 2)

`주요 역할`

- 기획, 디자인, 프론트엔드 개발

`세부 내용`

- 42PONG은 최초의 아케이드 비디오 게임이자 최초의 스포츠 아케이드 비디오 게임인 <퐁>을 개선하여 게임과 채팅(채팅 / DM)을 서비스하는 웹 어플리케이션 개발 프로젝트입니다.
- 42API를 이용한 로그인 기능과 **Google OTP**를 이용한 **2FA 인증**을 구현했습니다.
- Google Chrome, Firefox, Safari 간의 **크로스 브라우징**을 지원합니다.
- 로그인, 메인, 프로필, 랭킹, 채팅 개발을 담당했습니다.
- figma를 이용한 디자인 작업을 했습니다.

## 기술 스택
- `Vue.js` (composition API, Pinia)
- `TypeScript`
- `HTML` / `CSS` / `JavaScript`
- `Nest.js`
- `PostgreSQL`
- `Vite`
- `Prettier`
- `Docker` (Docker-compose)

## 실행 방법
Docker를 실행한 상태에서 진행해야 합니다.

```bash
make
# or
docker-compose up --build
```

`로그인 전 필수 요구사항`
- 42API를 이용한 로그인 방식으로 만들어진 프로젝트입니다.
- 42에 인증된 아이디가 필요합니다.

## 미리보기
<table>
<tr>
<td>
<img width="400" alt="image" src="https://user-images.githubusercontent.com/72684256/231345741-9969a182-7a74-48b1-860b-eacfc1314beb.png">
</td>
<td>
<img width="400" alt="image" src="https://user-images.githubusercontent.com/72684256/231345865-50d02aee-266a-4523-9232-c63132f61b59.png">
</td>
</tr>
<tr>
<td>
<img width="400" alt="image" src="https://user-images.githubusercontent.com/72684256/231346104-279fcca2-2bd6-45b7-9731-b8293f8042f8.png">
</td>
<td>
<img width="400" alt="image" src="https://user-images.githubusercontent.com/72684256/231346188-ac8c662b-f374-4bb9-92e1-c8fdcac3ed35.png">
</td>
</tr>
</table>
