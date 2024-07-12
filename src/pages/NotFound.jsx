import {Box, Button, Image, Text} from "@chakra-ui/react";
import notfound from "../assets/images/notfound.png";
import {Link} from "react-router-dom";
import theme from "../config/ThemeConfig.jsx";

export default function NotFound() {
    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            height="100vh"
            textAlign="center"
            backgroundColor="#E1E4EB"
        >
            <Text fontSize="5xl" marginBottom="10" marginTop="3" fontWeight="bold">
                Page Not Found
            </Text>
            <Image
                src={notfound}
                alt="Not Found"
                className="w-1/5"
                mb={4}
            />
            <Text fontSize="xl" marginBottom="7">
                Oops ! The page you are looking for does not exist.
            </Text>
            <Link to="/auth/login">
                <Button
                    bg={theme.purple}
                    _hover={{ bg: theme.onHoverPurple }}
                    color="#ffffff"
                    variant="solid"
                    type="submit"
                >
                    Go Back to Login
                </Button>
            </Link>
        </Box>
    );
}
