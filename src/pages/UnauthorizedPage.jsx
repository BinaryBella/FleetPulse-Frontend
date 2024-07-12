import {Box, Button, Image, Text} from "@chakra-ui/react";
import unauthorizedAccessImage from "../assets/images/unathorized_access.png";
import {Link} from "react-router-dom";
import theme from "../config/ThemeConfig.jsx";

export default function UnauthorizedAccess() {
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
                Whoops !
            </Text>
            <Image
                src={unauthorizedAccessImage}
                alt="Unauthorized Access"
                className="w-1/5"
                mb={4}
            />
            <Text fontSize="xl" marginBottom="7">
                You are not authorized to access this page
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
