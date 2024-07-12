/* eslint-disable react/prop-types */
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";

export default function PageHeader(props) {
    return (
        <div>
            <p className="text-3xl text-gray-700 mb-4">{props.title}</p>

            {props.breadcrumbs && (
                <Breadcrumb className="mb-6" spacing="15px" separator={<ChevronRightIcon color="gray.500" />}>
                    {props.breadcrumbs.map((breadcrumb, index) => (
                        <BreadcrumbItem key={index} className={breadcrumb.isReversed ? "flex flex-row-reverse" : ""}>
                            <BreadcrumbLink  href={breadcrumb.link}>{breadcrumb.label}</BreadcrumbLink>
                        </BreadcrumbItem>
                    ))}
                </Breadcrumb>
            )}
        </div>
    );
}
