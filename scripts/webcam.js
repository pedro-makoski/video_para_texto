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
            alert('Sua webcam não é compatível')
        })
} else {
    alert('Ops seu navegador não é compatível')
}

function reorganizando_imagem(dados) {
    const {width, height, data} = dados
    const res = []
    let linha = []
    let linha_idx = 0

    for(let pixel = 0; pixel < data.length; pixel += 4) {
        linha.push([data[pixel], data[pixel+1], data[pixel+2], 1])
        linha_idx += 1

        if(linha_idx === width) {
            res.push(linha)
            linha_idx = 0
            linha = []
        }
    }

    return res
}

function to_txt(data) {
    let texto = ''
    for(let linha = 0; linha < data.length; linha++) {
        let texto_linha = ''
        for(pixel = 0; pixel < data[linha].length; pixel++) {
            texto_linha += `<span style="color:rgba(${data[linha][pixel][0]}, ${data[linha][pixel][1]}, ${data[linha][pixel][2]}, ${data[linha][pixel][3]})">A</span>`
        }
        texto += texto_linha + '<br>'
    }

    return texto
}

function capturar() {
    function capturarFrame() {
        setTimeout(() => {
            const context = canvas.getContext('2d')
    
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
    
            context.drawImage(video, 0, 0, canvas.width*0.1, canvas.height*0.1)

            
            const imageData = context.getImageData(0, 0, canvas.width*0.1, canvas.height*0.1)
            const pixels = reorganizando_imagem(imageData)

            texto.innerHTML = to_txt(pixels)
        }, 1000)

        setTimeout(() => {
            requestAnimationFrame(capturarFrame)
        }, 1000)
    }

    video.addEventListener('loadeddata', () => {
        requestAnimationFrame(capturarFrame)
    })

}
