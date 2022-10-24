/**
 * @api {get} /user 자신의 유저 정보
 *
 * @apiVersion        1.0.0
 * @apiName getSelfUser
 * @apiGroup User
 * 
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "id": "76279",
 *          "nickname": "gunkim",
 *          "win": 0,
 *          "lose": 0,
 *          "ladder_win": 0,
 *          "ladder_lose": 0,
 *          "admin": false,
 *          "avatarPath": "users/avatar/76279",
 *          "twoFactorAuthenticationSecret": "LMME2FS5I5PHARDM",
 *          "isTwoFactorAuthenticationEnabled": false,
 *          "lating": 1000
 *      }
 */

/**
 * @api {post} /user/login 42 Oauth 로그인
 *
 * @apiVersion        1.0.0
 * @apiName OAuthLgoin
 * @apiGroup User
 *
 * @apiBody {String} code exmaple) 5b87e434f62c8d945224e4f16bb70df112ce0684c553429ca87baf4ab9bdc853.
 * 
 * @apiSuccess {String} success_message success.
 * 
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "message": "success"
 *      }
 */

/**
 * @api {post} /user 유저생성
 *
 * @apiVersion        1.0.0
 * @apiName createUser
 * @apiGroup User
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "id": "76279",
 *          "nickname": "gunkim",
 *          "win": 0,
 *          "lose": 0,
 *          "ladder_win": 0,
 *          "ladder_lose": 0,
 *          "admin": false,
 *          "avatarPath": "users/avatar/76279",
 *          "twoFactorAuthenticationSecret": "LMME2FS5I5PHARDM",
 *          "isTwoFactorAuthenticationEnabled": false,
 *          "lating": 1000
 *      }
 */

/**
 * @api {post} /user/nickname 닉네임 변경
 *
 * @apiVersion        1.0.0
 * @apiName updateNickname
 * @apiGroup User
 *
 * @apiBody {String} nickname ex)gunkim
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "id": "76279",
 *          "nickname": "gunkim",
 *          "win": 0,
 *          "lose": 0,
 *          "ladder_win": 0,
 *          "ladder_lose": 0,
 *          "admin": false,
 *          "avatarPath": "users/avatar/76279",
 *          "twoFactorAuthenticationSecret": "LMME2FS5I5PHARDM",
 *          "isTwoFactorAuthenticationEnabled": false,
 *          "lating": 1000
 *      }
 */

/**
 * @api {post} /user/avatar 아바타 업로드
 *
 * @apiVersion        1.0.0
 * @apiName uploadAvatar
 * @apiGroup User
 *
 * @apiBody {multipart/form-data} avatar ex)multer data
 * 
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "success"
 *      }
 */

/**
 * @api {get} /user/generate 2FA OTP값 생성
 *
 * @apiVersion        1.0.0
 * @apiName 2FA QRcode value generate
 * @apiGroup User
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "otpauth://totp/TEST:gunkim?secret=CIJQKNSYA4DASVSM&period=30&digits=6&algorithm=SHA1&issuer=TEST"
 *      }
 */

/**
 * @api {post} /user/turn-on 2FA 활성화하기
 *
 * @apiVersion        1.0.0
 * @apiName 2FA turn-On
 * @apiGroup User
 *
 * @apiBody {String} TOTP_CODE ex)"011256"
 * 
 * @apiSuccessExample Success-Response:
 *      NONE
 * @apiErrorExample Error-Response:
 *      HTTP/1.1 401 UnauthorizedException
 *      {
 *          "Wrong authentication code"
 *      }
 */

/**
 * @api {post} /user/turn-off 2FA 끄기
 *
 * @apiVersion        1.0.0
 * @apiName 2FA turn-off
 * @apiGroup User
 *

 * @apiSuccessExample Success-Response:
 *      NONE
 */

/**
 * @api {get} /user/friends 친구리스트
 *
 * @apiVersion        1.0.0
 * @apiName getFriends
 * @apiGroup User
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 401 UnauthorizedException
 *      [
 *          {
 *              "id": "76279",
 *              "nickname": "gunkim",
 *              "win": 0,
 *              "lose": 0,
 *              "ladder_win": 0,
 *              "ladder_lose": 0,
 *              "admin": false,
 *              "avatarPath": "users/avatar/76279",
 *              "twoFactorAuthenticationSecret": "CIJQKNSYA4DASVSM",
 *              "isTwoFactorAuthenticationEnabled": false,
 *              "lating": 1000
 *          },
 *          {
 *              ...
 *          }
 *      ]
 */

/**
 * @api {post} /user/friends 친구추가 
 *
 * @apiVersion        1.0.0
 * @apiName makeFriends
 * @apiGroup User
 *
 * @apiBody {String} nickname ex)"gunkim"
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 201 created
 *      {
 *          "type": 0,
 *          "from": {
 *              "id": "76328",
 *              "nickname": "sanghpar",
 *              "win": 0,
 *              "lose": 0,
 *              "ladder_win": 0,
 *              "ladder_lose": 0,
 *              "admin": false,
 *              "avatarPath": "users/avatar/76328",
 *              "twoFactorAuthenticationSecret": "PZ3HA2CVNRIWQ6QV",
 *              "isTwoFactorAuthenticationEnabled": false,
 *              "lating": 1000
 *          },
 *          "to": {
 *              "id": "76328",
 *              "nickname": "sanghpar",
 *              "win": 0,
 *              "lose": 0,
 *              "ladder_win": 0,
 *              "ladder_lose": 0,
 *              "admin": false,
 *              "avatarPath": "users/avatar/76328",
 *              "twoFactorAuthenticationSecret": "PZ3HA2CVNRIWQ6QV",
 *              "isTwoFactorAuthenticationEnabled": false,
 *              "lating": 1000
 *          }
 *      }
 */

/**
 * @api {delete} /user/friends 친구제거
 *
 * @apiVersion        1.0.0
 * @apiName deleteFriends
 * @apiGroup User
 *
 * @apiBody {String} nickname ex)"gunkim"
 */

/**
 * @api {get} /user/blocks 차단리스트
 *
 * @apiVersion        1.0.0
 * @apiName getblocks
 * @apiGroup User
 *
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 ㅒㅏ
 *      [
 *          {
 *              "id": "76279",
 *              "nickname": "gunkim",
 *              "win": 0,
 *              "lose": 0,
 *              "ladder_win": 0,
 *              "ladder_lose": 0,
 *              "admin": false,
 *              "avatarPath": "users/avatar/76279",
 *              "twoFactorAuthenticationSecret": "CIJQKNSYA4DASVSM",
 *              "isTwoFactorAuthenticationEnabled": false,
 *              "lating": 1000
 *          },
 *          {
 *              ...
 *          }
 *      ]
 */

/**
 * @api {post} /user/blocks 차단 추가 
 *
 * @apiVersion        1.0.0
 * @apiName makeblocks
 * @apiGroup User
 *
 * @apiBody {String} nickname ex)"gunkim"
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 201 created
 *      {
 *          "type": 0,
 *          "from": {
 *              "id": "76328",
 *              "nickname": "sanghpar",
 *              "win": 0,
 *              "lose": 0,
 *              "ladder_win": 0,
 *              "ladder_lose": 0,
 *              "admin": false,
 *              "avatarPath": "users/avatar/76328",
 *              "twoFactorAuthenticationSecret": "PZ3HA2CVNRIWQ6QV",
 *              "isTwoFactorAuthenticationEnabled": false,
 *              "lating": 1000
 *          },
 *          "to": {
 *              "id": "76328",
 *              "nickname": "sanghpar",
 *              "win": 0,
 *              "lose": 0,
 *              "ladder_win": 0,
 *              "ladder_lose": 0,
 *              "admin": false,
 *              "avatarPath": "users/avatar/76328",
 *              "twoFactorAuthenticationSecret": "PZ3HA2CVNRIWQ6QV",
 *              "isTwoFactorAuthenticationEnabled": false,
 *              "lating": 1000
 *          }
 *      }
 */

/**
 * @api {post} /user/avatar/default 기본 아바타로 변경
 *
 * @apiVersion        1.0.0
 * @apiName changeDefaultAvatar
 * @apiGroup User
 *
 * @apiBody {number} number ex) 0 ~ 3, 0~3 이외의 입력시 랜덤하게 0~3으로 설정
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 201 created
 *      {
 *          "success"
 *      }
 * 
 */

/**
 * @api {delete} /user/blocks 차단 해제
 *
 * @apiVersion        1.0.0
 * @apiName deleteblocks
 * @apiGroup User
 *
 * @apiBody {String} nickname ex)"gunkim"
 */

/**
 * @api {get} /user/dm DM메세지 가져오기
 *
 * @apiVersion        1.0.0
 * @apiName getDM
 * @apiGroup User
 *
 * @apiBody {nickname} string ex) "gunkim"
 * @apiSuccessExample Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          {
 *               "id": 2,
 *               "message": "hi",
 *               "createdAt": "2022-08-18T20:28:57.517Z"
 *           },
 *           {
 *               "id": 3,
 *               "message": "hi",
 *               "createdAt": "2022-08-18T20:29:21.236Z"
 *           },
 *           {
 *               "id": 4,
 *               "message": "hi",
 *               "createdAt": "2022-08-18T20:29:23.575Z"
 *           },
 *           {
 *               "id": 5,
 *               "message": "hi",
 *               "createdAt": "2022-08-18T20:29:23.749Z"
 *           }
 *           ...
 *      }
 * 
 */