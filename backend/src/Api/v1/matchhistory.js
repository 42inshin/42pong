/**
 * @api {post} /MatchHistory/:nickname 닉네임의 대전기록 가져오기
 *
 * @apiVersion        1.0.0
 * @apiName getHistoryByNickname
 * @apiGroup MatchHistory
 *
 * @apiParam {String} nickname 대전기록을 가져올 닉네임
 * 
 * @apiSuccessExample Success-Response: 성공시 MatchHistory[]반납
 *      HTTP/1.1 200 OK
 *      [
 *          {
 *              "id": 11,
 *              "player1Score": 11,
 *              "player2Score": 7,
 *              "createdAt": "2022-07-31T06:29:22.204Z",
 *              "player1": {
 *                  "id": "76328",
 *                  "nickname": "sanghpar",
 *                  "win": 0,
 *                  "lose": 0,
 *                  "ladder_win": 0,
 *                  "ladder_lose": 0,
 *                  "admin": false,
 *                  "avatarPath": "users/avatar/76328",
 *                  "twoFactorAuthenticationSecret": "PZ3HA2CVNRIWQ6QV",
 *                  "isTwoFactorAuthenticationEnabled": false,
 *                  "lating": 1000
 *              },
 *              "player2": {
 *                  "id": "76279",
 *                  "nickname": "gunkim",
 *                  "win": 0,
 *                  "lose": 0,
 *                  "ladder_win": 0,
 *                  "ladder_lose": 0,
 *                  "admin": false,
 *                  "avatarPath": "users/avatar/76279",
 *                  "twoFactorAuthenticationSecret": "CIJQKNSYA4DASVSM",
 *                  "isTwoFactorAuthenticationEnabled": false,
 *                  "lating": 1000
 *              }
 *          },
 *          {
 *              ...
 *          }
 *      ]
 *
 * @apiErrorExample Error-Response:
 *      HTTP/1.1 409 Conflict
 *      {
 *          "statusCode": 409,
 *          "message": "user_id don't belong in channle_id"
 *      }
 *      HTTP/1.1 400 BadRequestException
 *      {
 *          "statusCode": 400,
 *          "message": "user is not owner"
 *      }
 */