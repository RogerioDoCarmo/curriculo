import{n as e,o as t,s as n}from"./chunk-Bj-mKKzh.js";import{t as r}from"./react-BpPu5Nd-.js";import{a as i,i as a,r as o}from"./navigation-DU_myXrH.js";import{t as s}from"./jsx-runtime-D2H7xMg0.js";import{n as c,r as l}from"./ThemeToggle-BlAe8VID.js";var u,d,f=e((()=>{u=[`pt-BR`,`en`,`es`],d=`pt-BR`}));function p(e){if(u.includes(e))return e;let t=e.split(`-`)[0];return u.find(e=>e.split(`-`)[0]===t)||d}function m(){try{let e=localStorage.getItem(y);if(e&&u.includes(e))return e}catch{}return null}function h(e){try{localStorage.setItem(y,e)}catch{}}function g(){return p(navigator.language||`pt-BR`)}function _(e){let t=i(),n=a(),[r,o]=(0,v.useState)(e);return(0,v.useEffect)(()=>{let t=m();if(t&&t!==e)o(t);else if(!t){let t=g();t!==e&&o(t)}},[e]),{locale:r,setLocale:(0,v.useCallback)(e=>{o(e),h(e);let r=n.split(`/`);if((u.includes(r[1])?1:-1)!=-1){r[1]=e===`pt-BR`?``:e;let n=r.filter(Boolean).join(`/`)||`/`;t.push(`/${n}`)}else t.push(`/${e===`pt-BR`?``:e+`/`}${n}`)},[n,t]),availableLocales:[...u]}}var v,y,b=e((()=>{v=n(r()),o(),f(),y=`preferred-locale`}));function x({currentLocale:e,className:t=``}){let{locale:n,setLocale:r,availableLocales:i}=_(e),a=C[n];function o(e){r(e.target.value)}return(0,S.jsxs)(`div`,{className:`relative inline-flex items-center print:hidden ${t}`,children:[(0,S.jsx)(`label`,{htmlFor:`language-selector`,className:`sr-only`,children:`Select language`}),(0,S.jsx)(`span`,{"aria-hidden":`true`,className:`mr-1 text-base`,children:a.flag}),(0,S.jsx)(`select`,{id:`language-selector`,value:n,onChange:o,"aria-label":`Select language`,className:` appearance-none bg-transparent text-sm font-medium text-foreground border border-border rounded-md px-2 py-1 pr-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200 hover:bg-accent hover:text-accent-foreground `,children:i.map(e=>{let t=C[e];return(0,S.jsxs)(`option`,{value:e,children:[t.flag,` `,t.label]},e)})}),(0,S.jsx)(`span`,{"aria-hidden":`true`,className:`pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground text-xs`,children:`▾`})]})}var S,C,w=e((()=>{S=s(),b(),C={"pt-BR":{flag:`🇧🇷`,label:`Português (BR)`},en:{flag:`🇺🇸`,label:`English`},es:{flag:`🇪🇸`,label:`Español`}},x.__docgenInfo={description:``,methods:[],displayName:`LanguageSelector`,props:{currentLocale:{required:!0,tsType:{name:`SupportedLocale`},description:`Currently selected locale`},className:{required:!1,tsType:{name:`string`},description:`Additional CSS classes to apply`,defaultValue:{value:`""`,computed:!1}}}}})),T,E,D,O,k,A,j,M,N,P,F;e((()=>{T=s(),w(),E={title:`Components/LanguageSelector`,component:x,parameters:{layout:`centered`,docs:{description:{component:`LanguageSelector component — dropdown for switching between supported locales.

Features:
- Supports Brazilian Portuguese (pt-BR), English (en), and Spanish (es)
- Flag icons for visual recognition
- Persists language preference to localStorage
- Detects browser language on first visit
- Keyboard accessible with proper ARIA labels
- Integrates with next-intl for internationalization

Requirements: 11.5`}}},tags:[`autodocs`],argTypes:{currentLocale:{control:`select`,options:[`pt-BR`,`en`,`es`],description:`Currently selected locale`},className:{control:`text`,description:`Additional CSS classes to apply to the selector`}}},D={args:{currentLocale:`pt-BR`}},O={args:{currentLocale:`en`}},k={args:{currentLocale:`es`}},A={args:{currentLocale:`pt-BR`,className:`shadow-lg`}},j={render:()=>(0,T.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,T.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,T.jsx)(`span`,{className:`text-sm font-medium w-32`,children:`Portuguese (BR):`}),(0,T.jsx)(x,{currentLocale:`pt-BR`})]}),(0,T.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,T.jsx)(`span`,{className:`text-sm font-medium w-32`,children:`English:`}),(0,T.jsx)(x,{currentLocale:`en`})]}),(0,T.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,T.jsx)(`span`,{className:`text-sm font-medium w-32`,children:`Spanish:`}),(0,T.jsx)(x,{currentLocale:`es`})]})]})},M={render:()=>(0,T.jsxs)(`nav`,{className:`flex items-center justify-between p-4 bg-background border-b border-border min-w-[600px]`,children:[(0,T.jsx)(`div`,{className:`text-lg font-bold`,children:`My Website`}),(0,T.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,T.jsx)(`a`,{href:`#`,className:`text-sm hover:underline`,children:`Home`}),(0,T.jsx)(`a`,{href:`#`,className:`text-sm hover:underline`,children:`About`}),(0,T.jsx)(`a`,{href:`#`,className:`text-sm hover:underline`,children:`Contact`}),(0,T.jsx)(x,{currentLocale:`pt-BR`})]})]})},N={render:()=>(0,T.jsxs)(`div`,{className:`flex flex-col items-center gap-4 p-6 max-w-md`,children:[(0,T.jsx)(`h3`,{className:`text-lg font-semibold`,children:`Language Preferences`}),(0,T.jsx)(`p`,{className:`text-sm text-gray-600 dark:text-gray-400 text-center`,children:`Select your preferred language. The website supports Brazilian Portuguese, English, and Spanish.`}),(0,T.jsx)(x,{currentLocale:`pt-BR`}),(0,T.jsx)(`p`,{className:`text-xs text-gray-500 dark:text-gray-500 text-center`,children:`Your preference will be saved for future visits`})]})},P={render:()=>{let e=(l(),t(c)).default;return(0,T.jsxs)(`div`,{className:`flex items-center gap-3 p-4 border border-border rounded-lg`,children:[(0,T.jsx)(x,{currentLocale:`pt-BR`}),(0,T.jsx)(`div`,{className:`w-px h-6 bg-border`}),(0,T.jsx)(e,{})]})}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
  args: {
    currentLocale: "pt-BR" as SupportedLocale
  }
}`,...D.parameters?.docs?.source},description:{story:`Default language selector with Brazilian Portuguese`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
  args: {
    currentLocale: "en" as SupportedLocale
  }
}`,...O.parameters?.docs?.source},description:{story:`Language selector with English selected`,...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
  args: {
    currentLocale: "es" as SupportedLocale
  }
}`,...k.parameters?.docs?.source},description:{story:`Language selector with Spanish selected`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  args: {
    currentLocale: "pt-BR" as SupportedLocale,
    className: "shadow-lg"
  }
}`,...A.parameters?.docs?.source},description:{story:`Language selector with custom styling`,...A.parameters?.docs?.description}}},j.parameters={...j.parameters,docs:{...j.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-32">Portuguese (BR):</span>
        <LanguageSelector currentLocale={"pt-BR" as SupportedLocale} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-32">English:</span>
        <LanguageSelector currentLocale={"en" as SupportedLocale} />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium w-32">Spanish:</span>
        <LanguageSelector currentLocale={"es" as SupportedLocale} />
      </div>
    </div>
}`,...j.parameters?.docs?.source},description:{story:`Multiple language selectors showing all supported locales`,...j.parameters?.docs?.description}}},M.parameters={...M.parameters,docs:{...M.parameters?.docs,source:{originalSource:`{
  render: () => <nav className="flex items-center justify-between p-4 bg-background border-b border-border min-w-[600px]">
      <div className="text-lg font-bold">My Website</div>
      <div className="flex items-center gap-4">
        <a href="#" className="text-sm hover:underline">
          Home
        </a>
        <a href="#" className="text-sm hover:underline">
          About
        </a>
        <a href="#" className="text-sm hover:underline">
          Contact
        </a>
        <LanguageSelector currentLocale={"pt-BR" as SupportedLocale} />
      </div>
    </nav>
}`,...M.parameters?.docs?.source},description:{story:`Language selector in a navigation bar context`,...M.parameters?.docs?.description}}},N.parameters={...N.parameters,docs:{...N.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex flex-col items-center gap-4 p-6 max-w-md">
      <h3 className="text-lg font-semibold">Language Preferences</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
        Select your preferred language. The website supports Brazilian Portuguese, English, and
        Spanish.
      </p>
      <LanguageSelector currentLocale={"pt-BR" as SupportedLocale} />
      <p className="text-xs text-gray-500 dark:text-gray-500 text-center">
        Your preference will be saved for future visits
      </p>
    </div>
}`,...N.parameters?.docs?.source},description:{story:`Language selector with explanatory text`,...N.parameters?.docs?.description}}},P.parameters={...P.parameters,docs:{...P.parameters?.docs,source:{originalSource:`{
  render: () => {
    // Import ThemeToggle dynamically to avoid circular dependencies
    const ThemeToggle = require("../ThemeToggle").default;
    return <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
        <LanguageSelector currentLocale={"pt-BR" as SupportedLocale} />
        <div className="w-px h-6 bg-border" />
        <ThemeToggle />
      </div>;
  }
}`,...P.parameters?.docs?.source},description:{story:`Language selector combined with theme toggle`,...P.parameters?.docs?.description}}},F=[`Default`,`English`,`Spanish`,`WithCustomClass`,`AllLocales`,`InNavbar`,`WithExplanation`,`WithThemeToggle`]}))();export{j as AllLocales,D as Default,O as English,M as InNavbar,k as Spanish,A as WithCustomClass,N as WithExplanation,P as WithThemeToggle,F as __namedExportsOrder,E as default};