import{n as e}from"./chunk-BEldbCjX.js";import{p as t}from"./iframe-Cr2IFOVH.js";function n({text:e,highlight:t,className:n}){if(!t||!e)return(0,r.jsx)(`span`,{className:n,children:e});let i=t.replace(/[.*+?^${}()|[\]\\]/g,`\\$&`),a=RegExp(`(${i})`,`gi`);return(0,r.jsx)(`span`,{className:n,children:e.split(a).map((e,n)=>e.toLowerCase()===t.toLowerCase()?(0,r.jsx)(`strong`,{children:e},n):e)})}var r,i=e((()=>{r=t(),n.__docgenInfo={description:``,methods:[],displayName:`HighlightedText`,props:{text:{required:!0,tsType:{name:`string`},description:``},highlight:{required:!0,tsType:{name:`string`},description:``},className:{required:!1,tsType:{name:`string`},description:``}}}})),a,o,s,c,l,u,d,f,p;e((()=>{i(),a={title:`Components/HighlightedText`,component:n,parameters:{layout:`centered`,docs:{description:{component:`HighlightedText component highlights matching substrings within text.

Features:
- Case-insensitive matching
- Highlights all occurrences
- Falls back to regular text if highlight not found
- Escapes special regex characters`}}},tags:[`autodocs`],argTypes:{text:{control:`text`,description:`The full text content`},highlight:{control:`text`,description:`The substring to highlight (case-insensitive)`}}},o={args:{text:`This is a sample text with some words to highlight.`,highlight:`sample`}},s={args:{text:`React is great. I love React. React makes development easy.`,highlight:`React`}},c={args:{text:`TypeScript, typescript, TYPESCRIPT - all should be highlighted.`,highlight:`typescript`}},l={args:{text:`This text does not contain the search term.`,highlight:`missing`}},u={args:{text:`This text has no highlight applied.`,highlight:``}},d={args:{text:`Next.js is a React framework for building web applications.`,highlight:`React framework`}},f={args:{text:`A modern, responsive personal resume website built with Next.js 16, TypeScript, and Tailwind CSS. The site features multi-language support, dark mode, Firebase integration, comprehensive testing, and CI/CD automation.`,highlight:`Next.js`}},o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  args: {
    text: "This is a sample text with some words to highlight.",
    highlight: "sample"
  }
}`,...o.parameters?.docs?.source},description:{story:`Basic highlighting`,...o.parameters?.docs?.description}}},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    text: "React is great. I love React. React makes development easy.",
    highlight: "React"
  }
}`,...s.parameters?.docs?.source},description:{story:`Multiple occurrences`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    text: "TypeScript, typescript, TYPESCRIPT - all should be highlighted.",
    highlight: "typescript"
  }
}`,...c.parameters?.docs?.source},description:{story:`Case insensitive matching`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    text: "This text does not contain the search term.",
    highlight: "missing"
  }
}`,...l.parameters?.docs?.source},description:{story:`No match - fallback to regular text`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    text: "This text has no highlight applied.",
    highlight: ""
  }
}`,...u.parameters?.docs?.source},description:{story:`Empty highlight - shows regular text`,...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    text: "Next.js is a React framework for building web applications.",
    highlight: "React framework"
  }
}`,...d.parameters?.docs?.source},description:{story:`Highlighting a phrase`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  args: {
    text: "A modern, responsive personal resume website built with Next.js 16, TypeScript, and Tailwind CSS. The site features multi-language support, dark mode, Firebase integration, comprehensive testing, and CI/CD automation.",
    highlight: "Next.js"
  }
}`,...f.parameters?.docs?.source},description:{story:`Long text with highlighting`,...f.parameters?.docs?.description}}},p=[`Basic`,`MultipleOccurrences`,`CaseInsensitive`,`NoMatch`,`EmptyHighlight`,`HighlightPhrase`,`LongText`]}))();export{o as Basic,c as CaseInsensitive,u as EmptyHighlight,d as HighlightPhrase,f as LongText,s as MultipleOccurrences,l as NoMatch,p as __namedExportsOrder,a as default};