import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import RegisterForm from "./RegisterForm";

const pushMock = vi.fn();
const successMock = vi.fn();
const errorMock = vi.fn();

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: pushMock }),
}));

vi.mock("../hooks/useNotification", () => ({
    useNotification: () => ({ success: successMock, error: errorMock }),
}));

describe("RegisterForm", () => {
    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("keeps submit disabled until the password is strong and confirmation matches", async () => {
        render(<RegisterForm />);

        const usernameInput = screen.getByPlaceholderText("Usuário");
        const passwordInput = screen.getByPlaceholderText("Senha");
        const confirmInput = screen.getByPlaceholderText("Confirmar Senha");
        const submitButton = screen.getByRole("button", {
            name: /Criar conta/i,
        });

        expect(submitButton).toBeDisabled();

        await userEvent.type(usernameInput, "newuser");
        await userEvent.type(passwordInput, "Abc1234!");
        await userEvent.type(confirmInput, "Abc1234!");

        expect(submitButton).toBeEnabled();
        expect(
            within(
                screen.getByText("Mínimo de 8 caracteres").closest("li")!,
            ).getByText("✅"),
        ).toBeInTheDocument();
        expect(
            within(
                screen
                    .getByText("Pelo menos uma letra maiúscula")
                    .closest("li")!,
            ).getByText("✅"),
        ).toBeInTheDocument();
        expect(
            within(
                screen
                    .getByText("Pelo menos uma letra minúscula")
                    .closest("li")!,
            ).getByText("✅"),
        ).toBeInTheDocument();
        expect(
            within(
                screen.getByText("Pelo menos um número").closest("li")!,
            ).getByText("✅"),
        ).toBeInTheDocument();
        expect(
            within(
                screen
                    .getByText("Pelo menos um caractere especial")
                    .closest("li")!,
            ).getByText("✅"),
        ).toBeInTheDocument();
    });

    it("submits the form and navigates after successful registration", async () => {
        const fetchMock = vi.fn(() =>
            Promise.resolve({
                ok: true,
                json: () => Promise.resolve({ token: "jwt-token" }),
            }),
        );

        vi.stubGlobal("fetch", fetchMock);

        render(<RegisterForm />);

        const usernameInput = screen.getByPlaceholderText("Usuário");
        const passwordInput = screen.getByPlaceholderText("Senha");
        const confirmInput = screen.getByPlaceholderText("Confirmar Senha");
        const submitButton = screen.getByRole("button", {
            name: /Criar conta/i,
        });

        const validPassword = "Abc1234!";
        await userEvent.type(usernameInput, "newuser");
        await userEvent.type(passwordInput, validPassword);
        await userEvent.type(confirmInput, validPassword);

        expect(submitButton).toBeEnabled();

        await userEvent.click(submitButton);

        expect(fetchMock).toHaveBeenCalledWith(
            expect.stringContaining("/auth/register"),
            expect.objectContaining({
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: "newuser",
                    password: validPassword,
                }),
            }),
        );

        expect(pushMock).toHaveBeenCalledWith("/dashboard");
        expect(successMock).toHaveBeenCalledWith(
            "Conta criada!",
            "Bem-vindo! Você foi cadastrado com sucesso.",
        );
    });
});
