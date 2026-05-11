import{n as e,o as t}from"./chunk-BEldbCjX.js";import{F as n,n as r,p as i,t as a}from"./iframe-Cr2IFOVH.js";function o({className:e=``}){let{theme:t,toggleTheme:n}=r(),[i,a]=(0,c.useState)(!1);(0,c.useEffect)(()=>{a(!0)},[]);let o=t===`dark`,l=o?`Switch to light mode`:`Switch to dark mode`,u=o?`☀️`:`🌙`,d=o?`Sun`:`Moon`;return i?(0,s.jsx)(`button`,{type:`button`,onClick:n,"aria-label":l,title:l,className:`
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
      `,children:(0,s.jsx)(`span`,{role:`img`,"aria-label":d,className:`text-base leading-none`,children:u})}):(0,s.jsx)(`button`,{type:`button`,"aria-label":`Toggle theme`,title:`Toggle theme`,className:`
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
        `,"aria-disabled":`true`,children:(0,s.jsx)(`span`,{role:`img`,"aria-label":`Theme`,className:`text-base leading-none`,children:`☀️`})})}var s,c,l=e((()=>{s=i(),a(),c=t(n()),o.__docgenInfo={description:``,methods:[],displayName:`ThemeToggle`,props:{className:{required:!1,tsType:{name:`string`},description:`Additional CSS classes to apply to the button`,defaultValue:{value:`""`,computed:!1}}}}}));export{l as n,o as t};