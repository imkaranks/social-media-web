import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import useSignup from "@/hooks/useSignup";
import useMultistepForm from "@/hooks/useMultistepForm";
import useImageInput from "@/hooks/useImageInput";
import FirstStep from "@/components/SignUp/FirstStep";
import SecondStep from "@/components/SignUp/SecondStep";
import Button from "@/components/ui/Button";
import styles from "./index.module.css";

const initialState = {
  fullname: "",
  username: "",
  email: "",
  password: "",
  avatar: null,
};

export default function SignUp() {
  const [data, setData] = useState(initialState);
  const { imagePreview: avatarPreview, handleChange: handleAvatarChange } =
    useImageInput();
  const [success, setSuccess] = useState(false);

  const updateFormData = useCallback((newData) => {
    setData((prevData) => ({
      ...prevData,
      ...newData,
    }));
  }, []);

  const {
    stepComps,
    stepComp,
    currentStep,
    isFirstStep,
    isLastStep,
    nextStep,
    prevStep,
    jumpToStep,
  } = useMultistepForm([
    <FirstStep key={1} {...data} updateFormData={updateFormData} />,
    <SecondStep
      key={2}
      {...data}
      avatarPreview={avatarPreview}
      handleAvatarChange={handleAvatarChange}
      updateFormData={updateFormData}
    />,
  ]);
  const { signup, isSubmitting } = useSignup();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isLastStep) return nextStep();

    try {
      const formData = new FormData();

      for (const field in data) {
        formData.set(field, data[field]);
      }

      await signup(formData);
      setData(initialState);
      setSuccess(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : error);
    }
  };

  return (
    <div className="relative h-4/5 max-h-[34.1875rem] w-11/12 max-w-lg overflow-hidden overflow-y-auto bg-gray-50 dark:bg-[#2d2d2d] md:max-w-2xl lg:w-4/5">
      <div
        className="absolute left-0 top-0 z-10 h-full w-full -translate-x-[--popup-x-offset] translate-y-[--popup-y-offset] overflow-hidden bg-blue-200 transition-transform duration-300 ease-in-out dark:bg-blue-500"
        style={{
          "--popup-x-offset": `calc(${
            (100 / stepComps.length) * (stepComps.length - currentStep - 1)
          }%)`,
          "--popup-y-offset": success ? "0%" : "calc((100% - 0.5rem) * -1)",
        }}
      >
        <div className="grid h-full w-full place-items-center">
          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              jumpToStep(0);
            }}
            className="absolute right-6 top-6 inline-flex aspect-square items-center justify-center rounded-full border-2 border-white p-3 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
              fill="currentColor"
              className="size-8 2xl:size-10"
            >
              <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
            </svg>
          </button>

          <div
            className={
              success ? styles.signupPopupEnter : styles.signupPopupExit
            }
          >
            <p className="grid">
              <span className="grid justify-center text-6xl font-bold leading-none md:text-7xl lg:text-8xl">
                <span className="stroked text-white">thank</span>
                <span className="text-black" style={{ marginTop: "-.25em" }}>
                  you
                </span>
              </span>
              <span className="mx-auto my-4 max-w-[35ch] text-center text-black">
                A confirmation email has been sent to {data.email}. Please open
                it and click the button inside to confirm your verification.
              </span>
            </p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width={134}
              height={131}
              fill="none"
              className="mx-auto"
            >
              <g fill="#E65125" clipPath="url(#a)">
                <path d="M92.75 68.564c4.446 2.94 6.018 6.1 5.13 10.083-1.02 4.557-5.376 5.617-8.617 8.129 2.683 1.346 4.677 3.019 5.32 5.993.79 3.662-.216 7.003-3.44 8.937-13.56 8.124-26.828 16.74-40.759 24.25-8.405 4.532-17.202 5.918-26.455 3.617-15.549-3.863-25.416-18.618-23.743-35 1.12-10.967 4.527-21.417 6.948-32.087.98-4.32 1.954-8.646 2.879-12.977 1.1-5.164 4.933-8.008 9.72-7.134 4.824.88 7.466 5.114 6.527 10.385-1.14 6.405-2.261 12.81-3.351 19.22-.13.76-.643 1.764.361 2.261.88.432 1.508-.382 2.201-.819 3.105-1.949 6.22-3.883 9.354-5.782 7.938-4.793 15.896-9.56 23.843-14.343 3.874-2.326 7.742-4.662 11.615-6.983 7.154-4.28 12.75-1.407 13.444 6.893.02.236.126.462.286 1.05 2.95-2.125 5.994-3.653 9.616-2.216 1.854.734 3.31 1.914 4.305 3.662 2.286 4.01.794 7.712-5.19 12.861h.006ZM2.688 97.074c-.522 15.449 9.269 27.822 24.22 30.485 8.827 1.572 16.86-.729 24.531-5.069 12.67-7.174 24.958-14.976 37.462-22.426 3.422-2.04 4.391-5.37 2.558-8.264-1.86-2.94-5.054-3.457-8.556-1.357-6.24 3.743-12.449 7.546-18.729 11.218-1.03.603-2.421 2.532-3.546.563-.965-1.688 1.17-2.075 2.175-2.688 9.862-5.998 19.774-11.906 29.635-17.895 3.155-1.914 4.02-5.456 2.166-8.178-1.799-2.633-5.532-3.321-8.26-1.573a400.159 400.159 0 0 1-8.716 5.44 6760.218 6760.218 0 0 1-22.366 13.445c-.854.512-1.844 1.25-2.542-.076-.583-1.105.337-1.648 1.166-2.12.361-.206.718-.427 1.08-.643 12.82-7.711 25.651-15.408 38.452-23.15 3.336-2.02 4.05-4.737 2.25-7.822-1.647-2.823-4.998-3.657-8.068-1.883-5.852 3.375-11.695 6.766-17.482 10.258-7.15 4.31-14.228 8.737-21.342 13.102a16.31 16.31 0 0 1-1.542.834c-.623.296-1.16.096-1.517-.452-.367-.558-.297-1.19.176-1.608.557-.492 1.23-.859 1.874-1.25C57.849 69.89 67.942 63.841 78.01 57.742c3.084-1.869 3.964-5.26 2.26-8.219-1.652-2.873-4.425-3.431-7.791-1.497-6.888 3.959-13.74 7.993-20.477 12.178-8.51 5.285-17.388 9.957-25.687 15.579-1.387.939-2.823 1.537-4.436.597-1.678-.98-1.663-2.562-1.402-4.2 1.055-6.596 2.12-13.187 3.18-19.778.643-3.99-1.014-6.853-4.345-7.5-3.371-.654-5.928 1.4-6.813 5.334-1.446 6.446-2.954 12.877-4.466 19.302-2.145 9.108-5.008 18.07-5.345 27.525v.01Z" />
                <path d="M102.129 42.617c8.133-3.21 11.831-2.678 14.308 1.939 2.361 4.406.768 8.144-5.532 12.635 4.024 1.974 6.29 5.1 5.426 9.565-.849 4.386-4.737 6.19-8.48 8.41.738.412 1.206.648 1.653.92 5.32 3.255 5.566 10.544.381 14.036-2.768 1.869-5.712 3.481-8.57 5.215-.809.487-1.733 1.085-2.412.03-.778-1.216.277-1.769 1.161-2.301 2.577-1.552 5.169-3.085 7.722-4.682 3.059-1.914 4.044-4.863 2.637-7.692-1.346-2.713-4.24-3.737-7.485-2.537-.97.357-1.839.648-2.326-.472-.453-1.035.447-1.462 1.17-1.904 3.14-1.914 6.315-3.773 9.415-5.757 3.029-1.94 3.667-4.507 2.014-7.51-1.638-2.985-4.225-3.799-7.46-2.387-.884.387-1.919 1.653-2.718.035-.698-1.427.668-1.839 1.552-2.386 2.135-1.312 4.301-2.583 6.446-3.884 3.622-2.205 4.737-5.35 2.974-8.35-1.783-3.029-5.119-3.581-8.741-1.426-2.588 1.542-5.155 3.11-7.747 4.642-.799.477-1.718 1.02-2.386-.11-.669-1.126.286-1.618 1.044-2.156 3.999-2.823 4.482-6.727 1.201-9.555-1.984-1.708-4.114-1.673-6.264-.432-2.608 1.502-5.16 3.105-7.747 4.637-.844.497-1.839 1.306-2.567-.01-.699-1.271.467-1.744 1.31-2.256 2.141-1.306 4.417-2.431 6.421-3.919 6.617-4.918 14.273.443 13.6 7.652v.01ZM46.691 11.907v-.83c.221-4.556 1.724-8.46 6.205-10.323 4.436-1.849 8.209-.08 11.364 3.044 1.225 1.216 1.748 1.673 3.175.126C70.81.25 75.347-.83 78.995.754c3.898 1.693 6.239 5.923 6.053 10.937-.12 3.245-1.11 6.234-2.718 9.032-3.592 6.25-8.751 10.902-14.865 14.59-1.04.627-1.944.718-3.02.065-6.49-3.919-11.931-8.867-15.518-15.644-1.387-2.618-2.165-5.421-2.236-7.822v-.005Zm35.67-.307c0-.668.06-1.341-.01-2.004-.689-6.27-6.436-8.862-11.56-5.225-1.452 1.03-2.588 2.351-3.497 3.883-.914 1.533-1.889 1.543-2.798.015-.864-1.457-1.924-2.728-3.286-3.737C56.126.789 50.78 2.904 49.53 9.093c-.593 2.924-.04 5.672 1.155 8.29 3.03 6.621 8.234 11.248 14.162 15.192.85.562 1.508.381 2.281-.126 5.3-3.492 9.922-7.666 13.097-13.238 1.332-2.34 2.281-4.838 2.146-7.61h-.01ZM12.53 27.023c-1.236-.11-1.417-1.015-1.342-1.985.126-1.522-.256-2.421-2.034-2.18-.83.11-1.548-.271-1.548-1.216 0-.91.664-1.376 1.518-1.266 1.683.211 2.235-.482 2.07-2.105-.096-.93.045-2.004 1.336-1.96 1.266.046 1.341 1.131 1.26 2.056-.13 1.472.282 2.22 1.915 2.01.944-.121 1.713.316 1.648 1.38-.056.945-.85 1.216-1.653 1.111-1.658-.221-2.025.613-1.904 2.045.08.944-.025 1.884-1.271 2.115l.005-.005ZM43.828 43.365c2.28-.015 4.35 2.065 4.28 4.29-.065 2.096-1.94 3.844-4.124 3.839-2.296 0-4.13-1.844-4.1-4.115.03-2.185 1.814-4.004 3.939-4.019l.005.005Zm.256 5.582c.723-.13 1.341-.598 1.366-1.427.036-.95-.552-1.603-1.552-1.552-.854.04-1.366.608-1.341 1.492.025.879.557 1.336 1.527 1.487ZM134 71.6c-.111.894-.764 1.326-1.558 1.23-1.798-.215-2.11.709-1.974 2.196.09.99-.161 1.954-1.382 1.914-1.1-.035-1.215-.995-1.15-1.859.11-1.462-.156-2.456-1.985-2.24-.793.09-1.517-.272-1.532-1.241-.015-.96.668-1.382 1.477-1.306 1.97.196 2.17-.92 2.04-2.442-.07-.794.156-1.567 1.12-1.638.915-.07 1.492.573 1.382 1.392-.272 2.004.427 2.899 2.502 2.778.577-.035 1.024.507 1.06 1.226v-.01ZM92.549 16.202c.251.17.703.387 1.045.718 1.371 1.332 2.718 2.693 4.064 4.05.638.643 1.085 1.371.266 2.14-.673.628-1.391.377-1.984-.211a364.994 364.994 0 0 1-4.396-4.421c-.417-.427-.713-.94-.402-1.573.241-.492.648-.733 1.412-.708l-.005.005ZM41.517 17.217c-.17.28-.332.683-.613.964a263.328 263.328 0 0 1-4.426 4.436c-.588.573-1.256.884-1.96.16-.682-.697-.456-1.37.136-1.973a525.333 525.333 0 0 1 4.426-4.431c.437-.433.955-.724 1.578-.448.487.216.738.643.854 1.292h.005ZM36.181 3.708c.422.256.824.412 1.106.683a134.174 134.174 0 0 1 3.682 3.688c.487.507.759 1.115.201 1.763-.618.713-1.356.638-1.96.075a93.115 93.115 0 0 1-3.857-3.858c-.422-.442-.538-1.065-.141-1.597.226-.302.618-.483.975-.749l-.005-.005ZM92.327 10.686c-.567.03-.93-.276-1.185-.738-.282-.508-.141-1.005.216-1.372a179.397 179.397 0 0 1 4.029-4.029c.376-.367.889-.437 1.381-.201.493.236.714.658.689 1.206-.036.854-4.296 5.114-5.125 5.134h-.005Z" />
              </g>
              <defs>
                <clipPath id="a">
                  <path fill="#fff" d="M0 0h134v130.674H0z" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
      <div className="flex h-full flex-col space-y-4 p-6 sm:p-8 md:space-y-6">
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white md:text-2xl">
          Sign up to your account
        </h1>
        <form
          className="flex h-full flex-col space-y-4 md:space-y-6"
          onSubmit={handleSubmit}
        >
          {stepComp}

          <p className="text-sm font-light text-gray-500 dark:text-gray-400">
            Already have an account?{" "}
            <Link
              to="/sign-in"
              className="text-primary-600 dark:text-primary-500 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>

          <div className="!mt-auto flex items-center gap-4">
            {!isFirstStep && (
              <Button
                className="size-12 justify-center rounded-full"
                type="button"
                onClick={prevStep}
                disabled={isFirstStep || isSubmitting}
              >
                <span className="sr-only">Back</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#e8eaed"
                >
                  <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                </svg>
              </Button>
            )}
            <Button
              disabled={isSubmitting}
              className="ml-auto size-12 justify-center rounded-full"
            >
              {isSubmitting ? (
                <div
                  className="inline-block size-5 animate-spin rounded-full border-[3px] border-white border-t-transparent text-blue-600"
                  role="status"
                  aria-label="loading"
                >
                  <span className="sr-only">Loading...</span>
                </div>
              ) : (
                <>
                  <span className="sr-only">
                    {isLastStep ? "Sign up" : "Next"}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="#e8eaed"
                  >
                    <path d="M647-440H160v-80h487L423-744l57-56 320 320-320 320-57-56 224-224Z" />
                  </svg>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* <div className="!mt-10">
          <hr className="border-black/20 dark:border-white/20" />

          <h3 className="mx-auto w-fit -translate-y-1/2 bg-white px-8 dark:bg-[#2d2d2d] max-md:text-sm">
            Or continue with
          </h3>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Link
            to=""
            className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white"
          >
            <svg className="size-5" aria-hidden="true" viewBox="0 0 24 24">
              <path
                d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                fill="#EA4335"
              />
              <path
                d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                fill="#4285F4"
              />
              <path
                d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                fill="#FBBC05"
              />
              <path
                d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                fill="#34A853"
              />
            </svg>
            <span className="text-sm font-semibold">Google</span>
          </Link>
          <Link
            to=""
            className="inline-flex items-center justify-center gap-x-2 rounded-lg border border-transparent bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-gray-200 disabled:pointer-events-none disabled:opacity-50 dark:bg-white/10 dark:text-white dark:hover:bg-white/20 dark:hover:text-white"
          >
            <svg
              className="size-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm font-semibold">GitHub</span>
          </Link>
        </div> */}
      </div>
    </div>
  );
}
