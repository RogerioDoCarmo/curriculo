import{n as e,o as t}from"./chunk-BEldbCjX.js";import{F as n,g as r,h as i,m as a,p as o}from"./iframe-Cr2IFOVH.js";import{n as s,t as c}from"./ThemeToggle-DgfJD5m3.js";var l,u=e((()=>{l=[`pt-BR`,`en`,`es`]}));function d(){try{let e=localStorage.getItem(h);if(e&&l.includes(e))return e}catch{}return null}function f(e){try{localStorage.setItem(h,e)}catch{}}function p(e){let t=r(),n=i(),[a,o]=(0,m.useState)(e);return(0,m.useEffect)(()=>{let e=d();e&&e!==a&&o(e)},[]),(0,m.useEffect)(()=>{!d()&&a!==e&&o(e)},[e,a]),{locale:a,setLocale:(0,m.useCallback)(e=>{o(e),f(e);let r=n.split(`/`);if((l.includes(r[1])?1:-1)!=-1){r[1]=e===`pt-BR`?``:e;let n=r.filter(Boolean).join(`/`)||`/`;t.push(`/${n}`)}else t.push(`/${e===`pt-BR`?``:e+`/`}${n}`)},[n,t]),availableLocales:[...l]}}var m,h,g=e((()=>{m=t(n()),a(),u(),h=`preferred-locale`}));function _({currentLocale:e,className:t=``}){let{locale:n,setLocale:r,availableLocales:i}=p(e),a=y[n];function o(e){r(e.target.value)}return(0,v.jsxs)(`div`,{className:`relative inline-flex items-center print:hidden ${t}`,children:[(0,v.jsx)(`label`,{htmlFor:`language-selector`,className:`sr-only`,children:`Select language`}),(0,v.jsx)(`span`,{"aria-hidden":`true`,className:`mr-1 text-base`,children:a.flag}),(0,v.jsx)(`select`,{id:`language-selector`,value:n,onChange:o,"aria-label":`Select language`,className:` appearance-none bg-transparent text-sm font-medium text-foreground border border-border rounded-md px-2 py-1 pr-6 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200 hover:bg-accent hover:text-accent-foreground `,children:i.map(e=>{let t=y[e];return(0,v.jsxs)(`option`,{value:e,children:[t.flag,` `,t.label]},e)})}),(0,v.jsx)(`span`,{"aria-hidden":`true`,className:`pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground text-xs`,children:`▾`})]})}var v,y,b=e((()=>{v=o(),g(),y={"pt-BR":{flag:`🇧🇷`,label:`Português (BR)`},en:{flag:`🇺🇸`,label:`English`},es:{flag:`🇪🇸`,label:`Español`}},_.__docgenInfo={description:``,methods:[],displayName:`LanguageSelector`,props:{currentLocale:{required:!0,tsType:{name:`SupportedLocale`},description:`Currently selected locale`},className:{required:!1,tsType:{name:`string`},description:`Additional CSS classes to apply`,defaultValue:{value:`""`,computed:!1}}}}})),x,S,C,w,T,E,D,O,k,A,j;e((()=>{x=o(),b(),s(),S={title:`Components/LanguageSelector`,component:_,parameters:{layout:`centered`,docs:{description:{component:`LanguageSelector component — dropdown for switching between supported locales.

Features:
- Supports Brazilian Portuguese (pt-BR), English (en), and Spanish (es)
- Flag icons for visual recognition
- Persists language preference to localStorage
- Detects browser language on first visit
- Keyboard accessible with proper ARIA labels
- Integrates with next-intl for internationalization

Requirements: 11.5`}}},tags:[`autodocs`],argTypes:{currentLocale:{control:`select`,options:[`pt-BR`,`en`,`es`],description:`Currently selected locale`},className:{control:`text`,description:`Additional CSS classes to apply to the selector`}}},C={args:{currentLocale:`pt-BR`}},w={args:{currentLocale:`en`}},T={args:{currentLocale:`es`}},E={args:{currentLocale:`pt-BR`,className:`shadow-lg`}},D={render:()=>(0,x.jsxs)(`div`,{className:`flex flex-col gap-4`,children:[(0,x.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,x.jsx)(`span`,{className:`text-sm font-medium w-32`,children:`Portuguese (BR):`}),(0,x.jsx)(_,{currentLocale:`pt-BR`})]}),(0,x.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,x.jsx)(`span`,{className:`text-sm font-medium w-32`,children:`English:`}),(0,x.jsx)(_,{currentLocale:`en`})]}),(0,x.jsxs)(`div`,{className:`flex items-center gap-2`,children:[(0,x.jsx)(`span`,{className:`text-sm font-medium w-32`,children:`Spanish:`}),(0,x.jsx)(_,{currentLocale:`es`})]})]})},O={render:()=>(0,x.jsxs)(`nav`,{className:`flex items-center justify-between p-4 bg-background border-b border-border min-w-[600px]`,children:[(0,x.jsx)(`div`,{className:`text-lg font-bold`,children:`My Website`}),(0,x.jsxs)(`div`,{className:`flex items-center gap-4`,children:[(0,x.jsx)(`a`,{href:`#`,className:`text-sm hover:underline`,children:`Home`}),(0,x.jsx)(`a`,{href:`#`,className:`text-sm hover:underline`,children:`About`}),(0,x.jsx)(`a`,{href:`#`,className:`text-sm hover:underline`,children:`Contact`}),(0,x.jsx)(_,{currentLocale:`pt-BR`})]})]})},k={render:()=>(0,x.jsxs)(`div`,{className:`flex flex-col items-center gap-4 p-6 max-w-md`,children:[(0,x.jsx)(`h3`,{className:`text-lg font-semibold`,children:`Language Preferences`}),(0,x.jsx)(`p`,{className:`text-sm text-gray-600 dark:text-gray-400 text-center`,children:`Select your preferred language. The website supports Brazilian Portuguese, English, and Spanish.`}),(0,x.jsx)(_,{currentLocale:`pt-BR`}),(0,x.jsx)(`p`,{className:`text-xs text-gray-500 dark:text-gray-500 text-center`,children:`Your preference will be saved for future visits`})]})},A={render:()=>(0,x.jsxs)(`div`,{className:`flex items-center gap-3 p-4 border border-border rounded-lg`,children:[(0,x.jsx)(_,{currentLocale:`pt-BR`}),(0,x.jsx)(`div`,{className:`w-px h-6 bg-border`}),(0,x.jsx)(c,{})]})},C.parameters={...C.parameters,docs:{...C.parameters?.docs,source:{originalSource:`{
  args: {
    currentLocale: "pt-BR" as SupportedLocale
  }
}`,...C.parameters?.docs?.source},description:{story:`Default language selector with Brazilian Portuguese`,...C.parameters?.docs?.description}}},w.parameters={...w.parameters,docs:{...w.parameters?.docs,source:{originalSource:`{
  args: {
    currentLocale: "en" as SupportedLocale
  }
}`,...w.parameters?.docs?.source},description:{story:`Language selector with English selected`,...w.parameters?.docs?.description}}},T.parameters={...T.parameters,docs:{...T.parameters?.docs,source:{originalSource:`{
  args: {
    currentLocale: "es" as SupportedLocale
  }
}`,...T.parameters?.docs?.source},description:{story:`Language selector with Spanish selected`,...T.parameters?.docs?.description}}},E.parameters={...E.parameters,docs:{...E.parameters?.docs,source:{originalSource:`{
  args: {
    currentLocale: "pt-BR" as SupportedLocale,
    className: "shadow-lg"
  }
}`,...E.parameters?.docs?.source},description:{story:`Language selector with custom styling`,...E.parameters?.docs?.description}}},D.parameters={...D.parameters,docs:{...D.parameters?.docs,source:{originalSource:`{
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
}`,...D.parameters?.docs?.source},description:{story:`Multiple language selectors showing all supported locales`,...D.parameters?.docs?.description}}},O.parameters={...O.parameters,docs:{...O.parameters?.docs,source:{originalSource:`{
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
}`,...O.parameters?.docs?.source},description:{story:`Language selector in a navigation bar context`,...O.parameters?.docs?.description}}},k.parameters={...k.parameters,docs:{...k.parameters?.docs,source:{originalSource:`{
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
}`,...k.parameters?.docs?.source},description:{story:`Language selector with explanatory text`,...k.parameters?.docs?.description}}},A.parameters={...A.parameters,docs:{...A.parameters?.docs,source:{originalSource:`{
  render: () => <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
      <LanguageSelector currentLocale={"pt-BR" as SupportedLocale} />
      <div className="w-px h-6 bg-border" />
      <ThemeToggle />
    </div>
}`,...A.parameters?.docs?.source},description:{story:`Language selector combined with theme toggle`,...A.parameters?.docs?.description}}},j=[`Default`,`English`,`Spanish`,`WithCustomClass`,`AllLocales`,`InNavbar`,`WithExplanation`,`WithThemeToggle`]}))();export{D as AllLocales,C as Default,w as English,O as InNavbar,T as Spanish,E as WithCustomClass,k as WithExplanation,A as WithThemeToggle,j as __namedExportsOrder,S as default};