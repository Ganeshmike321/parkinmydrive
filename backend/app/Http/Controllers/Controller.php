<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

abstract class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;

    /**
     * Send a general success response.
     *
     * @param mixed $result
     * @param string $message
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendResponse($result, $message, $code = 200)
    {
        return response()->json([
            'status' => $code,
            'data' => $result,
            'message' => $message,
        ], $code);
    }

    /**
     * Send a general error response.
     *
     * @param string $error
     * @param array $errorMessages
     * @param int $code
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendError($error, $errorMessages = [], $code = 404)
    {
        $response = [
            'status' => $code,
            'message' => $error,
        ];

        if (!empty($errorMessages)) {
            $response['data'] = $errorMessages;
        }

        return response()->json($response, $code);
    }

    /**
     * Send a JWT-style success response.
     *
     * @param mixed $result
     * @param string $msg
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendjwtResponse($result, $msg)
    {
        return response()->json([
            'data' => $result,
            'msg' => $msg,
        ], 200);
    }

    /**
     * Send a JWT-style error response.
     *
     * @param string $error
     * @param array $errorMessages
     * @param int $code
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendjwtError($error, $errorMessages = [], $code = 400)
    {
        $response = [
            'msg' => $error,
        ];

        if (!empty($errorMessages)) {
            $response['data'] = $errorMessages;
        }

        return response()->json($response, $code);
    }

    /**
     * Send an API-style success response.
     *
     * @param string $message
     * @param string $log
     * @param string $transfereename
     * @param string $calibergauge
     * @param string $quantity
     * @param string $apptype
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendapiResponse($message, $log = '', $transfereename = '', $calibergauge = '', $quantity = '', $apptype = '')
    {
        return response()->json([
            'status' => 1,
            'message' => $message,
        ], 200);
    }

    /**
     * Send an API-style error response.
     *
     * @param string $errorMessages
     * @param int $code
     * @param string $log
     * @param string $transfereename
     * @param string $calibergauge
     * @param string $quantity
     * @param string $apptype
     * @return \Illuminate\Http\JsonResponse
     */
    protected function sendapiError($errorMessages, $code = 400, $log = '', $transfereename = '', $calibergauge = '', $quantity = '', $apptype = '')
    {
        return json_encode([
            'status' => 400,
            'message' => $errorMessages,
        ], $code);
    }
    protected function check_auth(){
        $auth = checkauth();
        if(empty($auth) || $auth==0){
            return $this->sendError('Unauthorized', [], 401);
        }
        return 0;
    }
}
