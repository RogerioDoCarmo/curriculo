import{n as e}from"./chunk-BEldbCjX.js";import{p as t}from"./iframe-Cr2IFOVH.js";function n({title:e,children:t,className:n=``}){return(0,r.jsxs)(`div`,{className:[`rounded-lg bg-white p-6 shadow-md transition-shadow duration-200`,`hover:shadow-lg`,`dark:bg-gray-800 dark:shadow-gray-900/50 dark:hover:shadow-gray-900/70`,`border border-transparent hover:border-primary-100 dark:hover:border-primary-900`,n].filter(Boolean).join(` `),children:[e&&(0,r.jsx)(`h2`,{className:`mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100`,children:e}),t]})}var r,i=e((()=>{r=t(),n.__docgenInfo={description:`Card component provides a container with consistent styling.

Features hover effects, optional title, and supports both light and dark themes.
Useful for displaying projects, experience items, or any grouped content.

@example
\`\`\`tsx
<Card title="Project Title">
  <p>Project description goes here</p>
</Card>
\`\`\`

@example
\`\`\`tsx
<Card>
  <p>Card without a title</p>
</Card>
\`\`\``,methods:[],displayName:`Card`,props:{title:{required:!1,tsType:{name:`string`},description:`Optional title displayed at the top of the card`},children:{required:!0,tsType:{name:`ReactNode`},description:`Content to display inside the card`},className:{required:!1,tsType:{name:`string`},description:`Additional CSS classes to apply`,defaultValue:{value:`""`,computed:!1}}}}})),a,o,s,c,l,u,d;e((()=>{a=t(),i(),o={title:`Components/Card`,component:n,parameters:{layout:`centered`,docs:{description:{component:`Card component provides a container with consistent styling.

Features hover effects, optional title, and supports both light and dark themes.`}}},tags:[`autodocs`],argTypes:{title:{control:`text`,description:`Optional title displayed at the top of the card`},children:{control:`text`,description:`Content to display inside the card`}}},s={args:{title:`Card Title`,children:`This is the card content. It can contain any React elements.`}},c={args:{children:`This card has no title, just content.`}},l={args:{title:`Project Card`,children:(0,a.jsxs)(`div`,{children:[(0,a.jsx)(`p`,{className:`text-gray-600 dark:text-gray-300 mb-4`,children:`A modern, responsive personal resume website built with Next.js 16, TypeScript, and Tailwind CSS.`}),(0,a.jsxs)(`div`,{className:`flex gap-2`,children:[(0,a.jsx)(`span`,{className:`px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm`,children:`Next.js`}),(0,a.jsx)(`span`,{className:`px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm`,children:`TypeScript`}),(0,a.jsx)(`span`,{className:`px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm`,children:`Tailwind`})]})]})}},u={render:()=>(0,a.jsxs)(`div`,{className:`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl`,children:[(0,a.jsx)(n,{title:`Card 1`,children:(0,a.jsx)(`p`,{className:`text-gray-600 dark:text-gray-300`,children:`First card content`})}),(0,a.jsx)(n,{title:`Card 2`,children:(0,a.jsx)(`p`,{className:`text-gray-600 dark:text-gray-300`,children:`Second card content`})}),(0,a.jsx)(n,{title:`Card 3`,children:(0,a.jsx)(`p`,{className:`text-gray-600 dark:text-gray-300`,children:`Third card content`})})]})},s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Card Title",
    children: "This is the card content. It can contain any React elements."
  }
}`,...s.parameters?.docs?.source},description:{story:`Card with title`,...s.parameters?.docs?.description}}},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{
  args: {
    children: "This card has no title, just content."
  }
}`,...c.parameters?.docs?.source},description:{story:`Card without title`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    title: "Project Card",
    children: <div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          A modern, responsive personal resume website built with Next.js 16, TypeScript, and
          Tailwind CSS.
        </p>
        <div className="flex gap-2">
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
            Next.js
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
            TypeScript
          </span>
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded text-sm">
            Tailwind
          </span>
        </div>
      </div>
  }
}`,...l.parameters?.docs?.source},description:{story:`Card with rich content`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  render: () => <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl">
      <Card title="Card 1">
        <p className="text-gray-600 dark:text-gray-300">First card content</p>
      </Card>
      <Card title="Card 2">
        <p className="text-gray-600 dark:text-gray-300">Second card content</p>
      </Card>
      <Card title="Card 3">
        <p className="text-gray-600 dark:text-gray-300">Third card content</p>
      </Card>
    </div>
}`,...u.parameters?.docs?.source},description:{story:`Multiple cards in a grid`,...u.parameters?.docs?.description}}},d=[`WithTitle`,`WithoutTitle`,`WithRichContent`,`CardGrid`]}))();export{u as CardGrid,l as WithRichContent,s as WithTitle,c as WithoutTitle,d as __namedExportsOrder,o as default};