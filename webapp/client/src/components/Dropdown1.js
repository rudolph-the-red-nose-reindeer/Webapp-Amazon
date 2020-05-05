import React, { useState } from 'react';
//import onClickOutside from 'react-onclickoutside';

function Dropdown1({ title, multiSelect = false }) {
 const [open, setOpen] = useState(false);
 const [selection, setSelection] = useState([]);
 const toggle = () => setOpen(!open);
 const itemz = [
 	{id: 1, value:'Get top reviewers'},{id:2, value:'Get most recent reviews' },{id: 3, value:'Top products a reviewer has reviewed' },
 ];
 Dropdown1.handleClickOutside = () => setOpen(false);

 function handleOnClick(item) {
   if (!selection.some(current => current.id === item.id)) {
     if (!multiSelect) {
       setSelection([item]);
     } else if (multiSelect) {
       setSelection([...selection, item]);
     }
   } else {
     let selectionAfterRemoval = selection;
     selectionAfterRemoval = selectionAfterRemoval.filter(
       current => current.id !== item.id
     );
     setSelection([...selectionAfterRemoval]);
   }
 }

 function isItemInSelection(item) {
   if (selection.some(current => current.id === item.id)) {
     return true;
   }
   return false;
 }

 return (
   <div className="dd-wrapper">
     <div
       tabIndex={0}
       className="dd-header"
       role="button"
       onKeyPress={() => toggle(!open)}
       onClick={() => toggle(!open)}
     >
       <div className="dd-header__title">
         <p className="dd-header__title--bold">{title}</p>
       </div>
       <div className="dd-header__action">
         <p>{open ? 'Close' : 'Open'}</p>
       </div>
     </div>
     {open && (
       <ul className="dd-list">
         {itemz.map(item => (
           <li className="dd-list-item" key={item.id}>
             <button type="button" onClick={() => handleOnClick(item)}>
               <span>{item.value}</span>
               <span>{isItemInSelection(item) && <a  href={"/" + item.value}>{item.value.charAt(0).toUpperCase() + item.value.substring(1, item.value.length)}</a>}</span>

             </button>
           </li>
         ))}
       </ul>
     )}
   </div>
 );
}

export default Dropdown1;
