const glyphs_JP = "，、。！？〈〉《》「」『』【】〔〕・（）：；［］｛｝"
const glyphs_JPs = "，〈〉《》「」『』【】〔〕（）［］｛｝"
const glyphs_MP = "，、。！？《》「」『』【】〔〕・（）：；［］｛｝"
const glyphs_MPs = "，《》「」『』【】〔〕（）［］｛｝"
const glyphs_RP = "，、。！？〈〉《》「」『』【】〔〕・（）：；［］｛｝"
const glyphs_RPs = "，〈〉《》「」『』【】〔〕（）［］｛｝"

const split_JP = glyphs_JP.split("")
const split_JPs = glyphs_JPs.split("")
const split_MP = glyphs_MP.split("")
const split_MPs = glyphs_MPs.split("")
const split_RP = glyphs_RP.split("")
const split_RPs = glyphs_RPs.split("")

const arr_uni_JP = []
const arr_uni_JPs = []
const arr_uni_MP = []
const arr_uni_MPs = []
const arr_uni_RP = []
const arr_uni_RPs = []

function cvtUni(c) {
  return "U+" + ("000" + c.charCodeAt(0).toString(16)).substr(-4)
}

split_JP.forEach(c => {
  arr_uni_JP.push(cvtUni(c))
})
split_JPs.forEach(c => {
  arr_uni_JPs.push(cvtUni(c))
})
split_MP.forEach(c => {
  arr_uni_MP.push(cvtUni(c))
})
split_MPs.forEach(c => {
  arr_uni_MPs.push(cvtUni(c))
})
split_RP.forEach(c => {
  arr_uni_RP.push(cvtUni(c))
})
split_RPs.forEach(c => {
  arr_uni_RPs.push(cvtUni(c))
})

arr_uni_JP.sort()
arr_uni_JPs.sort()
arr_uni_MP.sort()
arr_uni_MPs.sort()
arr_uni_RP.sort()
arr_uni_RPs.sort()

const str_uni_JP = arr_uni_JP.join()
const str_uni_JPs = arr_uni_JPs.join()
const str_uni_MP = arr_uni_MP.join()
const str_uni_MPs = arr_uni_MPs.join()
const str_uni_RP = arr_uni_RP.join()
const str_uni_RPs = arr_uni_RPs.join()

console.log("$yakuhanjps-narrow-unicode: " + str_uni_JPs + " !default;")
console.log("$yakuhanjps-noto-unicode: " + str_uni_JPs + " !default;")
console.log("$yakuhanjps-unicode: " + str_uni_JPs + " !default;")

console.log("$yakuhanjp-narrow-unicode: " + str_uni_JP + " !default;")
console.log("$yakuhanjp-noto-unicode: " + str_uni_JP + " !default;")
console.log("$yakuhanjp-unicode: " + str_uni_JP + " !default;")

console.log("$yakuhanmps-noto-unicode: " + str_uni_MPs + " !default;")
console.log("$yakuhanmps-unicode: " + str_uni_MPs + " !default;")

console.log("$yakuhanmp-noto-unicode: " + str_uni_MP + " !default;")
console.log("$yakuhanmp-unicode: " + str_uni_MP + " !default;")

console.log("$yakuhanrps-unicode: " + str_uni_RPs + " !default;")

console.log("$yakuhanrp-unicode: " + str_uni_RP + " !default;")
