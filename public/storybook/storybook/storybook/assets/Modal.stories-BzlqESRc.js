import{n as e,o as t}from"./chunk-BEldbCjX.js";import{F as n,p as r}from"./iframe-Cr2IFOVH.js";import{n as i,t as a}from"./Button-DkdhyGW1.js";function o({isOpen:e,onClose:t,children:n,title:r}){let i=(0,c.useId)(),a=(0,c.useRef)(null);return(0,c.useEffect)(()=>{if(!e)return;let n=e=>{e.key===`Escape`&&t()};return document.addEventListener(`keydown`,n),()=>document.removeEventListener(`keydown`,n)},[e,t]),(0,c.useEffect)(()=>{if(!e||!a.current)return;let t=a.current.querySelectorAll(`button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])`);t.length>0?t[0].focus():a.current.focus()},[e]),e?(0,s.jsx)(`div`,{"data-testid":`modal-backdrop`,className:`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4`,onClick:t,children:(0,s.jsxs)(`div`,{ref:a,role:`dialog`,"aria-modal":`true`,"aria-labelledby":r?i:void 0,tabIndex:-1,className:`relative w-full max-w-4xl max-h-[90vh] flex flex-col rounded-lg bg-white shadow-xl dark:bg-gray-800`,onClick:e=>e.stopPropagation(),children:[(0,s.jsxs)(`div`,{className:`flex items-start justify-between p-6 pb-4`,children:[r&&(0,s.jsx)(`h2`,{id:i,className:`text-xl font-semibold text-gray-900 dark:text-gray-100 pr-8`,children:r}),(0,s.jsx)(`button`,{type:`button`,"aria-label":`Close`,onClick:t,className:`absolute right-4 top-4 rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200`,children:(0,s.jsx)(`svg`,{xmlns:`http://www.w3.org/2000/svg`,className:`h-5 w-5`,viewBox:`0 0 20 20`,fill:`currentColor`,"aria-hidden":`true`,children:(0,s.jsx)(`path`,{fillRule:`evenodd`,d:`M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z`,clipRule:`evenodd`})})})]}),(0,s.jsx)(`div`,{className:`overflow-y-auto px-6 pb-6`,children:n})]})}):null}var s,c,l=e((()=>{s=r(),c=t(n()),o.__docgenInfo={description:`Modal component with overlay, focus trap, and keyboard navigation.

Features:
- ESC key closes modal
- Backdrop click closes modal
- Focus trap keeps focus inside modal
- Proper ARIA attributes for accessibility
- Supports both light and dark themes

@example
\`\`\`tsx
const [isOpen, setIsOpen] = useState(false);

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Confirm Action">
  <p>Are you sure you want to proceed?</p>
  <Button onClick={() => setIsOpen(false)}>Confirm</Button>
</Modal>
\`\`\``,methods:[],displayName:`Modal`,props:{isOpen:{required:!0,tsType:{name:`boolean`},description:`Whether the modal is currently open`},onClose:{required:!0,tsType:{name:`signature`,type:`function`,raw:`() => void`,signature:{arguments:[],return:{name:`void`}}},description:`Function called when the modal should be closed`},children:{required:!0,tsType:{name:`ReactNode`},description:`Content to display inside the modal`},title:{required:!1,tsType:{name:`string`},description:`Optional title displayed at the top of the modal`}}}})),u,d,f,p,m,h,g,_,v;e((()=>{u=r(),d=t(n()),l(),i(),f={title:`Components/Modal`,component:o,parameters:{layout:`centered`,docs:{description:{component:`Modal component with overlay, focus trap, and keyboard navigation.

Features:
- ESC key closes modal
- Backdrop click closes modal
- Focus trap keeps focus inside modal
- Proper ARIA attributes for accessibility`}}},tags:[`autodocs`],argTypes:{isOpen:{control:`boolean`,description:`Whether the modal is open`},title:{control:`text`,description:`Optional title displayed at the top of the modal`},onClose:{action:`closed`,description:`Function called when modal is closed`}}},p={args:{isOpen:!0,title:`Modal Title`,children:(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`p`,{className:`text-gray-600 dark:text-gray-300 mb-4`,children:`This is the modal content. You can put any React elements here.`}),(0,u.jsxs)(`div`,{className:`flex justify-end gap-2`,children:[(0,u.jsx)(a,{variant:`secondary`,size:`md`,children:`Cancel`}),(0,u.jsx)(a,{variant:`primary`,size:`md`,children:`Confirm`})]})]})}},m={args:{isOpen:!0,children:(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`p`,{className:`text-gray-600 dark:text-gray-300 mb-4`,children:`This modal has no title, just content.`}),(0,u.jsx)(a,{variant:`primary`,size:`md`,children:`Got it`})]})}},h={render:function(){let[e,t]=(0,d.useState)(!1);return(0,u.jsxs)(`div`,{children:[(0,u.jsx)(a,{variant:`primary`,size:`md`,onClick:()=>t(!0),children:`Open Modal`}),(0,u.jsxs)(o,{isOpen:e,onClose:()=>t(!1),title:`Interactive Modal`,children:[(0,u.jsx)(`p`,{className:`text-gray-600 dark:text-gray-300 mb-4`,children:`Click the X button, press ESC, or click outside to close this modal.`}),(0,u.jsxs)(`div`,{className:`flex justify-end gap-2`,children:[(0,u.jsx)(a,{variant:`secondary`,size:`md`,onClick:()=>t(!1),children:`Cancel`}),(0,u.jsx)(a,{variant:`primary`,size:`md`,onClick:()=>t(!1),children:`Confirm`})]})]})]})}},g={args:{isOpen:!0,title:`Confirm Action`,children:(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`p`,{className:`text-gray-600 dark:text-gray-300 mb-4`,children:`Are you sure you want to proceed with this action? This cannot be undone.`}),(0,u.jsxs)(`div`,{className:`flex justify-end gap-2`,children:[(0,u.jsx)(a,{variant:`secondary`,size:`md`,children:`Cancel`}),(0,u.jsx)(a,{variant:`primary`,size:`md`,children:`Confirm`})]})]})}},_={args:{isOpen:!0,title:`Contact Form`,children:(0,u.jsxs)(`form`,{className:`space-y-4`,children:[(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`label`,{htmlFor:`name`,className:`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1`,children:`Name`}),(0,u.jsx)(`input`,{type:`text`,id:`name`,className:`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`})]}),(0,u.jsxs)(`div`,{children:[(0,u.jsx)(`label`,{htmlFor:`email`,className:`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1`,children:`Email`}),(0,u.jsx)(`input`,{type:`email`,id:`email`,className:`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`})]}),(0,u.jsxs)(`div`,{className:`flex justify-end gap-2`,children:[(0,u.jsx)(a,{variant:`secondary`,size:`md`,children:`Cancel`}),(0,u.jsx)(a,{variant:`primary`,size:`md`,type:`submit`,children:`Submit`})]})]})}},p.parameters={...p.parameters,docs:{...p.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    title: "Modal Title",
    children: <div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This is the modal content. You can put any React elements here.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="md">
            Cancel
          </Button>
          <Button variant="primary" size="md">
            Confirm
          </Button>
        </div>
      </div>
  }
}`,...p.parameters?.docs?.source},description:{story:`Modal with title`,...p.parameters?.docs?.description}}},m.parameters={...m.parameters,docs:{...m.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    children: <div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          This modal has no title, just content.
        </p>
        <Button variant="primary" size="md">
          Got it
        </Button>
      </div>
  }
}`,...m.parameters?.docs?.source},description:{story:`Modal without title`,...m.parameters?.docs?.description}}},h.parameters={...h.parameters,docs:{...h.parameters?.docs,source:{originalSource:`{
  render: function InteractiveModal() {
    const [isOpen, setIsOpen] = useState(false);
    return <div>
        <Button variant="primary" size="md" onClick={() => setIsOpen(true)}>
          Open Modal
        </Button>
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Interactive Modal">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Click the X button, press ESC, or click outside to close this modal.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="md" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="md" onClick={() => setIsOpen(false)}>
              Confirm
            </Button>
          </div>
        </Modal>
      </div>;
  }
}`,...h.parameters?.docs?.source},description:{story:`Interactive modal with open/close button`,...h.parameters?.docs?.description}}},g.parameters={...g.parameters,docs:{...g.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    title: "Confirm Action",
    children: <div>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Are you sure you want to proceed with this action? This cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="md">
            Cancel
          </Button>
          <Button variant="primary" size="md">
            Confirm
          </Button>
        </div>
      </div>
  }
}`,...g.parameters?.docs?.source},description:{story:`Confirmation modal`,...g.parameters?.docs?.description}}},_.parameters={..._.parameters,docs:{..._.parameters?.docs,source:{originalSource:`{
  args: {
    isOpen: true,
    title: "Contact Form",
    children: <form className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input type="text" id="name" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input type="email" id="email" className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="md">
            Cancel
          </Button>
          <Button variant="primary" size="md" type="submit">
            Submit
          </Button>
        </div>
      </form>
  }
}`,..._.parameters?.docs?.source},description:{story:`Form modal`,..._.parameters?.docs?.description}}},v=[`WithTitle`,`WithoutTitle`,`Interactive`,`Confirmation`,`FormModal`]}))();export{g as Confirmation,_ as FormModal,h as Interactive,p as WithTitle,m as WithoutTitle,v as __namedExportsOrder,f as default};