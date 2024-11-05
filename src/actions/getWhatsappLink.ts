import axios from 'axios'

function getWhatsappLink(title: string, autorEncarnado: string, dataDaPublicacao: string, precoNaInternet: string, sinopse: string) {
    return axios.get('/api/whatsapp-link')
}