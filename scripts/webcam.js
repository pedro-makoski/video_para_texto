const video = document.getElementById('webcam')
const canvas = document.getElementById('texto_video')
const texto = document.querySelector('.texto')

if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
        .then((video_da_webcam) => {
            video.srcObject = video_da_webcam
            capturar()
        })
        .catch((error) => {
            alert('Você precisa aceitar para funcionar')
        })
} else {
    alert('Ops seu navegador não é compatível')
}

function to_txt(dados, pixelsize) {
    let res = ''
    const {width, height, data} = dados
    const densidade = 'Ñ@#W$9876543210?abc;:+=-,._'
    let len = densidade.length
    
    for(let linha_pos = 1; linha_pos <= height; linha_pos+=pixelsize) {
        let cont = 0;
        for(let colum_pos = 1; colum_pos <= width; colum_pos+=pixelsize) {
            cont++
            let i = (width*(linha_pos-1) + colum_pos) * 4

            let [r, g, b, count] = [data[i], data[i+1], data[i+2], 0];
            
            if(pixelsize !== 1) {
                [r, g, b] = [0, 0, 0]

                for(let posY = linha_pos; posY < linha_pos+pixelsize && posY < height; posY++) {
                    for(let posX = colum_pos; posX < colum_pos+pixelsize && posX < width; posX++) {
                        i = (width*(posY-1) + posX) * 4     
                        
                        r += data[i]
                        g += data[i+1]
                        b += data[i+2]
    
                        count++
                    }
                }
    
                
                r = r/count
                g = g/count
                b = b/count

            }
            
            let media = (r+g+b)/3
            let index = 27 - Math.floor((media/255)*len) - 1
            
            res += `<span style="color:rgba(${r}, ${g}, ${b}, 1);">${densidade[index]}</span>`
        }

        res += '<br>'
        console.log(cont)
        cont = 0
    }

    return res
}


function capturar() {
    function capturarFrame() {
        setTimeout(() => {
            const context = canvas.getContext('2d')
    
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
    
            context.drawImage(video, 0, 0, canvas.width, canvas.height)

            
            const imageData = context.getImageData(0, 0, canvas.width, canvas.height)

            texto.innerHTML = to_txt(imageData, 7)
        }, 100)

        setTimeout(() => {
            requestAnimationFrame(capturarFrame)
        }, 100)
    }

    video.addEventListener('loadeddata', () => {
        requestAnimationFrame(capturarFrame)
    })

}
