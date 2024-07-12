import ResetPass3 from "../assets/images/ResetPass3.png";
import { Box, Button, Stack } from "@chakra-ui/react";
import theme from "../config/ThemeConfig.jsx";
import { Formik } from "formik";
import { useNavigate } from "react-router-dom";

export default function ResetPassSuccess() {
    const navigate = useNavigate(); // Define navigate within the component

    const handleSubmit = () => {
        navigate("/auth/Login");
    };

    return (
        <>
            <p className="font-sans text-3xl text-[#393970] mb-7">Reset Password</p>
            <img src={ResetPass3} alt="ResetPassword" className="w-1/3 mb-4"/>
            <Box textAlign="center" w="50%" fontSize="sm">
                <p className="text-2xl text-[#D49458] font-bold mb-4">Password Updated</p>
                <p className="mb-6">Your password has been updated</p>
            </Box>
            <Formik
                initialValues={{}}
                onSubmit={handleSubmit}
            >
                {({ handleSubmit }) => (
                    <form onSubmit={handleSubmit} className="w-1/2">
                        <Stack>
                            <Button
                                bg={theme.purple}
                                _hover={{ bg: theme.onHoverPurple }}
                                color="#ffffff"
                                variant="solid"
                                type="submit"
                                size="sm"
                            >
                                Login
                            </Button>
                        </Stack>
                    </form>
                )}
            </Formik>
        </>
    );
}
