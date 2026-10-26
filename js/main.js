document.documentElement.classList.add("js");

document.querySelectorAll(".header-container").forEach((header, index) => {
  const nav = header.querySelector(".nav");

  if (!nav) {
    return;
  }

  const navId = nav.id || `navegacao-principal-${index + 1}`;
  nav.id = navId;

  const toggle = document.createElement("button");
  toggle.className = "menu-toggle";
  toggle.type = "button";
  toggle.setAttribute("aria-controls", navId);
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Abrir menu de navegação");
  toggle.innerHTML = "<span></span><span></span><span></span>";
  header.insertBefore(toggle, nav);

  const closeMenu = () => {
    header.classList.remove("menu-aberto");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu de navegação");
  };

  toggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-aberto");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute(
      "aria-label",
      isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação",
    );
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && header.classList.contains("menu-aberto")) {
      closeMenu();
      toggle.focus();
    }
  });
});

document.querySelectorAll(".faq-item").forEach((item, index) => {
  const heading = item.querySelector("h3");
  const answer = item.querySelector("p");

  if (!heading || !answer) {
    return;
  }

  const question = document.createElement("button");
  const answerId = `resposta-faq-${index + 1}`;
  question.className = "faq-question";
  question.type = "button";
  question.id = `pergunta-faq-${index + 1}`;
  question.setAttribute("aria-expanded", "false");
  question.setAttribute("aria-controls", answerId);
  question.innerHTML = `${heading.textContent.trim()}<span aria-hidden="true">+</span>`;

  answer.id = answerId;
  answer.hidden = true;
  heading.replaceChildren(question);

  question.addEventListener("click", () => {
    const isExpanded = question.getAttribute("aria-expanded") === "true";
    question.setAttribute("aria-expanded", String(!isExpanded));
    answer.hidden = isExpanded;
    question.querySelector("span").textContent = isExpanded ? "+" : "−";
  });
});

document.querySelectorAll("form[data-demo-form]").forEach((form) => {
  const feedback = document.createElement("p");
  feedback.className = "form-feedback";
  feedback.setAttribute("role", "status");
  feedback.setAttribute("aria-live", "polite");
  form.append(feedback);

  form.querySelectorAll("input, select, textarea").forEach((field) => {
    field.addEventListener("invalid", () => {
      field.classList.add("campo-invalido");
      field.setAttribute("aria-invalid", "true");
      feedback.classList.remove("form-feedback-sucesso");
    });

    field.addEventListener("input", () => {
      field.classList.remove("campo-invalido");
      field.setAttribute("aria-invalid", "false");
      field.setCustomValidity("");
      feedback.textContent = "";
      feedback.classList.remove("form-feedback-sucesso");
    });

    field.addEventListener("change", () => {
      field.classList.remove("campo-invalido");
      field.setAttribute("aria-invalid", "false");
      field.setCustomValidity("");
      feedback.textContent = "";
      feedback.classList.remove("form-feedback-sucesso");
    });
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    feedback.textContent =
      form.dataset.demoForm === "doacao"
        ? "Simulação concluída. Nenhuma cobrança ou envio de dados foi realizado."
        : "Mensagem validada. Este protótipo não envia dados para um servidor.";
    feedback.classList.add("form-feedback-sucesso");
  });
});

const donationForm = document.querySelector("#formulario-doacao");

if (donationForm) {
  const amountInput = donationForm.querySelector("#valor-doacao");
  const customAmount = donationForm.querySelector("#outro-valor");
  const amountButtons = donationForm.querySelectorAll("[data-valor-doacao]");

  amountButtons.forEach((button) => {
    button.addEventListener("click", () => {
      amountInput.value = button.dataset.valorDoacao;
      customAmount.value = "";
      amountButtons.forEach((option) => {
        option.setAttribute("aria-pressed", String(option === button));
      });
      amountInput.setCustomValidity("");
      amountInput.classList.remove("campo-invalido");
      amountInput.setAttribute("aria-invalid", "false");
    });
  });

  customAmount.addEventListener("input", () => {
    amountInput.value = customAmount.value;
    amountInput.classList.remove("campo-invalido");
    amountInput.setAttribute("aria-invalid", "false");
    amountButtons.forEach((button) => {
      button.setAttribute("aria-pressed", "false");
    });
  });

  const donorType = donationForm.querySelector("#tipo-doador");
  const documentInput = donationForm.querySelector("#documento");

  const isValidDocument = (value, type) => {
    const digits = value.replace(/\D/g, "");
    const expectedLength = type === "cpf" ? 11 : 14;

    if (
      digits.length !== expectedLength ||
      new Set(digits).size === 1
    ) {
      return false;
    }

    const numbers = [...digits].map(Number);
    const calculateDigit = (values, weights) =>
      (values.reduce((sum, number, index) => sum + number * weights[index], 0) *
        10) %
      11 %
      10;

    if (type === "cpf") {
      const firstDigit = calculateDigit(
        numbers.slice(0, 9),
        [10, 9, 8, 7, 6, 5, 4, 3, 2],
      );
      const secondDigit = calculateDigit(
        numbers.slice(0, 10),
        [11, 10, 9, 8, 7, 6, 5, 4, 3, 2],
      );

      return numbers[9] === firstDigit && numbers[10] === secondDigit;
    }

    const firstDigit = calculateDigit(
      numbers.slice(0, 12),
      [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    );
    const secondDigit = calculateDigit(
      numbers.slice(0, 13),
      [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
    );

    return numbers[12] === firstDigit && numbers[13] === secondDigit;
  };

  const validateDocument = () => {
    if (!documentInput.value) {
      documentInput.setCustomValidity("");
      return;
    }

    documentInput.setCustomValidity(
      isValidDocument(documentInput.value, donorType.value)
        ? ""
        : `Informe um ${donorType.value === "cpf" ? "CPF" : "CNPJ"} válido.`,
    );
  };

  donorType.addEventListener("change", () => {
    documentInput.value = "";
    documentInput.placeholder =
      donorType.value === "cpf"
        ? "Digite os 11 dígitos do CPF"
        : donorType.value === "cnpj"
          ? "Digite os 14 dígitos do CNPJ"
          : "Selecione o tipo de doador primeiro";
    documentInput.disabled = !donorType.value;
    documentInput.setCustomValidity("");
    documentInput.classList.remove("campo-invalido");
    documentInput.setAttribute("aria-invalid", "false");
  });

  documentInput.addEventListener("input", validateDocument);
  documentInput.addEventListener("change", validateDocument);
  donationForm.addEventListener("submit", validateDocument, true);

  document.querySelectorAll("a[data-programa]").forEach((link) => {
    link.addEventListener("click", () => {
      const program = donationForm.querySelector("#programa");
      program.value = link.dataset.programa;
    });
  });
}

const contactSubject = new URLSearchParams(window.location.search).get("assunto");
const subjectField = document.querySelector("#assunto");

if (contactSubject && subjectField) {
  subjectField.value = contactSubject;
}

document.querySelectorAll(".filtros").forEach((filters) => {
  const table = filters.parentElement.querySelector(".tabela-painel tbody");

  if (!table) {
    return;
  }

  const selects = [...filters.querySelectorAll("select")];
  const rows = [...table.rows];
  let status = filters.querySelector(".filter-status");

  if (!status) {
    status = document.createElement("p");
    status.className = "filter-status";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    filters.append(status);
  }

  const updateRows = () => {
    let visibleRows = 0;

    rows.forEach((row) => {
      const matches = selects.every((select) => {
        if (select.selectedIndex === 0) {
          return true;
        }

        const cell = row.cells[Number(select.dataset.filterColumn)];

        if (!cell) {
          return true;
        }

        if (select.dataset.filterPeriod) {
          const [day, month, year] = cell.textContent.trim().split("/").map(Number);
          const donationDate = new Date(year, month - 1, day);
          const today = new Date();
          const period = select.selectedOptions[0].textContent.toLocaleLowerCase("pt-BR");
          const start =
            period === "este mês"
              ? new Date(today.getFullYear(), today.getMonth(), 1)
              : period.includes("3 meses")
                ? new Date(today.getFullYear(), today.getMonth() - 2, 1)
                : new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());

          return (
            !Number.isNaN(donationDate.getTime()) &&
            donationDate >= start &&
            donationDate <= today
          );
        }

        return cell.textContent
          .trim()
          .toLocaleLowerCase("pt-BR")
          .includes(select.value.trim().toLocaleLowerCase("pt-BR"));
      });

      row.hidden = !matches;

      if (matches) {
        visibleRows += 1;
      }
    });

    status.textContent = `${visibleRows} ${
      visibleRows === 1 ? "registro encontrado" : "registros encontrados"
    }.`;
  };

  selects.forEach((select) => select.addEventListener("change", updateRows));
  updateRows();
});
