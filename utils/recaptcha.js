

export async function getRecaptchaToken(site_key) {
    return new Promise (resolve => {
        grecaptcha.ready(async () => {
            const token = await grecaptcha.execute(`${site_key}`, { action: "submit" }).then()
            resolve(token)
        })    
    }) 
}