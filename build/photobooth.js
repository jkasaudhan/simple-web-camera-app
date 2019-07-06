export var CameraMode;
(function (CameraMode) {
    CameraMode["User"] = "user";
    CameraMode["Environment"] = "environment";
})(CameraMode || (CameraMode = {}));
export class Defaults {
}
Defaults.width = 640;
class PhotoBooth {
    static init() {
        console.log('initializing....');
        PhotoBooth.buttons.take_photo = document.querySelector("button[name='take_photo']");
        PhotoBooth.buttons.switch_cam = document.querySelector("button[name='switch_cam']");
        PhotoBooth.buttons.take_photo.onclick = () => { PhotoBooth.take_photo(); };
        PhotoBooth.buttons.switch_cam.onclick = () => { PhotoBooth.switch_cam(); };
        navigator.mediaDevices.enumerateDevices().then((devices) => {
            if (devices.length < 1) {
                PhotoBooth.buttons.take_photo.disabled = true;
            }
            if (devices.length < 2) {
                PhotoBooth.buttons.switch_cam.disabled = true;
            }
            PhotoBooth.init_camera();
        }).catch((err) => {
            console.log('Browser medica devices error: ', err);
        });
    }
    static init_camera() {
        let constraints = { audio: false, video: { facingMode: PhotoBooth.mode } };
        navigator.mediaDevices.getUserMedia(constraints).then(PhotoBooth.on_get_media);
    }
    static on_get_media(stream) {
        PhotoBooth.canvas = document.createElement('canvas');
        PhotoBooth.video = document.querySelector('video');
        PhotoBooth.video.onloadedmetadata = () => { PhotoBooth.video.play(); };
        PhotoBooth.video.oncanplay = () => { PhotoBooth.on_video_ready(); };
        PhotoBooth.video.srcObject = stream;
    }
    static on_video_ready() {
        PhotoBooth.canvas.width = Defaults.width;
        PhotoBooth.canvas.height = PhotoBooth.video.videoHeight / (PhotoBooth.video.videoWidth / Defaults.width);
        PhotoBooth.video.setAttribute('height', PhotoBooth.canvas.height.toString());
        PhotoBooth.video.setAttribute('width', PhotoBooth.canvas.width.toString());
    }
    static take_photo() {
        console.log('take photo');
        let context = PhotoBooth.canvas.getContext('2d');
        context.drawImage(PhotoBooth.video, 0, 0, PhotoBooth.canvas.width, PhotoBooth.canvas.height);
        let url = PhotoBooth.canvas.toDataURL('image/jpeg');
        let a = document.createElement('a');
        a.href = url;
        a.target = '_blank';
        a.download = 'photo.jpeg';
        a.click();
    }
    static switch_cam() {
        PhotoBooth.mode = (PhotoBooth.mode == CameraMode.User) ? CameraMode.Environment : CameraMode.User;
        PhotoBooth.init_camera();
    }
}
PhotoBooth.mode = CameraMode.Environment;
PhotoBooth.buttons = { take_photo: null, switch_cam: null };
PhotoBooth.init();
console.log('photo booth');
