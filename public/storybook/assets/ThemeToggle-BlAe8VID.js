import{n as e,r as t,s as n}from"./chunk-Bj-mKKzh.js";import{t as r}from"./react-BpPu5Nd-.js";import{t as i}from"./jsx-runtime-D2H7xMg0.js";function a(){try{let e=localStorage.getItem(m);if(e===`light`||e===`dark`)return e}catch{}return null}function o(e){try{localStorage.setItem(m,e)}catch{}}function s(){return window.matchMedia(`(prefers-color-scheme: dark)`).matches?`dark`:`light`}function c(){return a()??s()}function l(e){typeof document>`u`||(e===`dark`?document.documentElement.classList.add(`dark`):document.documentElement.classList.remove(`dark`))}function u({children:e,defaultTheme:t}){let[n,r]=(0,p.useState)(t??`light`);(0,p.useEffect)(()=>{let e=c();r(e),l(e)},[]);let i=(0,p.useCallback)(e=>{r(e),o(e),l(e)},[]),a=(0,p.useCallback)(()=>{r(e=>{let t=e===`light`?`dark`:`light`;return o(t),l(t),t})},[]);return(0,f.jsx)(h.Provider,{value:{theme:n,setTheme:i,toggleTheme:a},children:e})}function d(){let e=(0,p.useContext)(h);if(!e)throw Error(`useTheme must be used within a ThemeProvider`);return e}var f,p,m,h,g=e((()=>{f=i(),p=n(r()),m=`theme`,h=(0,p.createContext)(null),u.__docgenInfo={description:`ThemeProvider — wraps the app and provides theme context.
Must be used as a client component.`,methods:[],displayName:`ThemeProvider`,props:{children:{required:!0,tsType:{name:`ReactNode`},description:``},defaultTheme:{required:!1,tsType:{name:`Theme`},description:``}}}})),_=t({default:()=>v});function v({className:e=``}){let{theme:t,toggleTheme:n}=d(),r=t===`dark`,i=r?`Switch to light mode`:`Switch to dark mode`,a=r?`☀️`:`🌙`,o=r?`Sun`:`Moon`;return(0,y.jsx)(`button`,{type:`button`,onClick:n,"aria-label":i,title:i,className:`
        inline-flex items-center justify-center
        w-9 h-9 rounded-md
        border border-border
        bg-transparent
        text-foreground
        transition-colors duration-200
        hover:bg-accent hover:text-accent-foreground
        focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
        print:hidden
        ${e}
      `,children:(0,y.jsx)(`span`,{role:`img`,"aria-label":o,className:`text-base leading-none`,children:a})})}var y,b=e((()=>{y=i(),g(),v.__docgenInfo={description:``,methods:[],displayName:`ThemeToggle`,props:{className:{required:!1,tsType:{name:`string`},description:`Additional CSS classes to apply to the button`,defaultValue:{value:`""`,computed:!1}}}}}));export{_ as n,b as r,v as t};