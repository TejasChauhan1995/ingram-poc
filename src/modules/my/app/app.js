import { LightningElement, track } from 'lwc';
import Quagga from 'quagga';

export default class App extends LightningElement {
    @track isCameraOpen = false;
    @track isReady = false; 
    cameraStream;
    videoElement;
    wrapperElement;
    barcodeIds = [];
    serialNumber = 0;

handleScanClick() {
let trg =this.template.querySelector('div');
        let config = {
            inputStream: {
              type: 'LiveStream',
              constraints: {
                width: { min: 640 },
                height: { min: 480 },
                aspectRatio: { min: 1, max: 100 },
                facingMode: 'environment' // Use the rear camera for mobile devices
              },
              target: trg // ID of the container to display the camera stream
            },
            decoder: {
              readers: ['code_128_reader', 'ean_reader', 'ean_8_reader', 'code_39_reader', 'code_39_vin_reader', 'codabar_reader', 'upc_reader', 'upc_e_reader', 'i2of5_reader', '2of5_reader', 'code_93_reader'],
            },
            locate: true
          };
          try{
            console.log('Quagga >>>> ', Quagga);
          Quagga.init(config, function (err) {
            if (err) {
              console.error(err);
              return;
            }
            Quagga.start();
          });
          Quagga.onDetected(this.handleBarcodeDetected);
         /* Quagga.onDetected(function (result) { 
            console.log('Code decoded >>>>>> ',result.codeResult.code);
          });*/
        }catch(error){
            console.log(error);
        }
       
    }
  
    handleBarcodeDetected = (result) => {
        const barcodeId = result.codeResult.code;
        const barcodeDetail = { SrNo: '', BarcodeID: '' }; // Corrected variable name
        barcodeDetail.SrNo = this.serialNumber + 1;
        barcodeDetail.BarcodeID = barcodeId;
        this.barcodeIds.push(barcodeDetail);
        this.isReady = true;
        this.isCameraOpen = true;
        console.log(this.barcodeIds);
        
    }

    handleCompleteClick() {
        if (this.barcodeIds.length > 0) {
            //this.isCameraOpen = false;
            this.isReady = true;
            this.isScanAgain = true; // Added this line
        }
        //Quagga.stop();
     
    }
    handleSubmitClick() {
        // Submit logic here
        Quagga.stop();
        console.log('Submit button clicked!');
    }
}
