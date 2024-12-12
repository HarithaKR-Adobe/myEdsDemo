function handleSubmit(evt) {
    debugger;
}

function createLabel(field) {
    const label = document.createElement("label");
    label.classList.add("field-label");
    label.innerHTML = field.Label;
    label.setAttribute("for", field.Field);
    return label
}

function createInput(field) {
    const input = document.createElement("input");
    input.classList.add("field-input");
    input.name = field.Field;
    input.type = field.format ? field.format : "text";
    input.placeholder = field.Placeholder;
    return input;
}

function appendElementstoField(fieldEl, ...elements) {
    elements.forEach((el) => {
        fieldEl.append(el);
    })
}

function createSelect (field) {
    if (!field.Options) return 
    const select = document.createElement("select");
    select.name = field.Field;
    select.placeholder = field.Placeholder;
    select.innerHTML = `
        ${field.Options.split(", ").map((item) => `<option value=${item}>${item}</option>`).join("")}
    `;
    return select;
}

function createForm(fields, actionUrl) {
    const form = document.createElement("form");
    form.action = new URL(actionUrl);
    form.method = "POST";
    form.submit = handleSubmit;
    
    fields.forEach((field) => {
        const fieldEl = document.createElement("div");
        fieldEl.classList.add("form-field", field.Mandatory ? "required" : "");
        form.append(fieldEl);
        let label, input, select, button;
        switch(field.Type) {
            case "input":
                label = createLabel(field);
                input = createInput(field);
                appendElementstoField(fieldEl, label, input);
                break;
            case "select":
                label = createLabel(field);
                select = createSelect(field);
                appendElementstoField(fieldEl, label, select);
                if (field.Mandatory) {
                    fieldEl.classList.add("required");
                }
                if (!select) {
                    form.remove(fieldEl);
                }
                break;
            case "submit": 
                const button = document.createElement("button");
                button.classList.add("ui", "button");
                button.type = field.Type;
                button.innerHTML = field.Label;
                appendElementstoField(fieldEl, button);
                break;
            default:
                 form.remove(fieldEl);
        }
    });
    return form;
}

export default async function decorate(block) {
    const form = block.querySelector('a[href$=".json"]');
    const fieldsResp = await fetch(new URL(form.href));
    const fields = await fieldsResp.json();
    const formEl = createForm(fields.data, form.href);

    block.children[0].replaceWith(formEl);
}