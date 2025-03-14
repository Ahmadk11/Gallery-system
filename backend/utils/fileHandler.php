<?php
class FileHandler {

    public static function processBase64Image($base64String) {

        if(empty($base64String)) {
            return false;
        }
        
        if(strpos($base64String, ',') !== false) {
            $base64String = explode(',', $base64String)[1];
        }
        
        $decoded = base64_decode($base64String, true);
        if($decoded === false) {
            return false;
        }
        
        return $base64String;
    }
    
    public static function getImageDataUrl($base64String, $imageType = 'jpeg') {
        return 'data:image/' . $imageType . ';base64,' . $base64String;
    }
}
?>