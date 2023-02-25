import axios from "axios"
import * as cheerio from 'cheerio'
import { results } from "../index.js"



export const amazon = async(i, q) => {
    try {
        let result = []
        let j = 1
        while (result.length < q){
            const response = await axios.get("https://www.amazon.com/s?s=price-desc-ranks&k=" + i + "&page=" + j)
            const html = response.data
            const $ = cheerio.load(html)
            
        
            $('[data-component-type="s-search-result"]').each((index, el) => {
                const name = $(el).find('span.a-size-base-plus.a-color-base.a-text-normal').eq(0).text() || $(el).find('span.a-size-medium.a-color-base.a-text-normal').eq(0).text()
                const img = $(el).find('img').eq(0).attr('src')
                let price =  $(el).find('.a-price-whole').text() + $(el).find('.a-price-fraction').text()
                const ecommerce = "Amazon"
                const url = "https://www.amazon.com" + $(el).find('a').attr('href')
                let price2 = Number(price)
                result.push({name, img, price, ecommerce, url, price2})
                
            })
            result = result.filter(i => i.price !== "")
            result = result.filter(i => i.price2 !== "")
           
            j++
            
        }
        results.push(...result.slice(0,q))
           } catch (error) {
            console.log(error)
           }
}

export const newegg = async(i, q) => {
    try {
         const response = await axios.get("https://www.newegg.com/p/pl?d=" + i)
         const html = response.data
         const $ = cheerio.load(html)
         let result = []
     
         $('.item-cells-wrap .item-cell').each((index, el) => {
             const name = $(el).find('.item-title').eq(0).text()
             const img = $(el).find('img').eq(0).attr('src')
             let price =  $(el).find('.price-current strong').text() + $(el).find('.price-current sup').text()
             const ecommerce = "newEgg"
             const url = $(el).find('a').attr('href')
             let price2 = Number(price)
             result.push({name, img, price, ecommerce, url, price2})
            })
            result = result.filter(i => i.price !== "")
            results.push(...result.slice(0,q))
          
        return
         
        } catch (error) {
         console.log(error)
        }
}

export const ebay = async(i, q) => {
    try {
        const response = await axios.get("https://www.ebay.com/sch/i.html?_nkw=" + i )
        const html = response.data
        const $ = cheerio.load(html)
        let result = []
    
        $('.s-item__wrapper').each((index, el) => {
            const name = $(el).find('.s-item__info .s-item__title span').eq(0).text()
            const img = $(el).find('.s-item__image-section img').eq(0).attr('src')
            const url = $(el).find('a').attr('href')
            let price = $(el).find('.s-item__details .s-item__price').eq(0).text()
            let price2 = ""
            if(!price.includes("a")){
                price = price.replace("USD", "")
                price2 = Number(price)
            }else if(price.includes("a")){

                price2 = ((Number(price.replace("USD", "").replace("USD", "").split(" a ")[0]) + Number(price.replace("USD", "").replace("USD", "").split(" a ")[1])) / 2)
                price = price.replace("USD", "").replace("USD", "$")
                
            }
            
           
            const ecommerce = "eBay"

            result.push({name, img, price, ecommerce, url, price2})
        })
        result = result.slice(1)
        result = result.filter(i => i.price !== "")
        results.push(...result.slice(0,q))
        
        return
      
       } catch (error) {
        console.log(error)
       }
}