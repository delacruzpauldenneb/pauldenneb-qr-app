import { Html5Qrcode } from "html5-qrcode";

export default {
  mounted() {
    const html5QrCode = new Html5Qrcode("reader");
    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: 250
      },
      (decodedText) => {
        console.log("QR Code scanned:", decodedText);
      },
      (errorMessage) => {
        // Handle decode failure
      }
    );
  }
};
