// libraries
import React, { useEffect, useState } from "react";
import { Handle } from "reactflow";

// style
import "./attribute.css";

// hooks
import { useEditorContext } from "../../../hooks/useEditorContext";
import { useControlContext } from "../../../hooks/useControlContext";

// svg
import KeyIcon from "../../../assets/svg/Key";
import NotNull from "../../../assets/svg/NotNull";
import Unique from "../../../assets/svg/Unique";

const CustomAttribute = ({ dataAttr }) => {
    const [isConnected, setIsConnected] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const { isEditMode } = useControlContext();

    const { data } = useEditorContext();

    useEffect(() => {
        setIsEdit(isEditMode);
    }, [isEditMode]);

    useEffect(() => {
        if (data) {
            if (data.diagram.edges) {
                data.diagram.edges.forEach((edge) => {
                    if (
                        edge.sourceHandle.split("-")[0] == dataAttr.id ||
                        edge.targetHandle.split("-")[0] == dataAttr.id
                    ) {
                        setIsConnected(true);
                    }
                });
            }
        }
    }, [data]);
    return ( <
        div className = "nodrag custom-attribute" >
        <
        div className = "custom-attribute-mainLine" > { " " } {
            dataAttr.primaryKey || dataAttr.foreignKey ? (
                dataAttr.primaryKey ? ( <
                    KeyIcon width = { 20 }
                    height = { 20 }
                    color = { "#e6e600" }
                    />
                ) : ( <
                    KeyIcon width = { 20 }
                    height = { 20 }
                    color = { "var(--color_grey)" }
                    />
                )
            ) : ( <
                KeyIcon width = { 20 }
                height = { 20 }
                color = { "transparent" }
                />
            )
        } { " " } <
        p > { dataAttr.label } < /p>{" "} <
        /div>{" "} <
        div className = "custom-attribute-secondLine"
        style = {
            { justifyContent: isEdit ? "space-between" : "flex-end" } } >
        <
        p className = "greyText" > { dataAttr.type } < /p>{" "} <
        div className = "custom-attribute-params" > { " " } {
            isEdit && ( <
                >
                <
                KeyIcon width = { 20 }
                height = { 20 }
                color = { dataAttr.primaryKey ? "black" : "var(--color_grey)" }
                />{" "} <
                NotNull width = { 15 }
                height = { 15 }
                color = { dataAttr.notNull ? "black" : "var(--color_grey)" }
                />{" "} <
                Unique width = { 20 }
                height = { 20 }
                color = { dataAttr.unique ? "black" : "var(--color_grey)" }
                />{" "} <
                />
            )
        } { " " } <
        /div>{" "} <
        /div>{" "} <
        Handle position = "right"
        style = {
            {
                background: isConnected ? "#b4b4b6" : "#ececec",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
            }
        }
        id = { `${dataAttr.id}-handle-right` }
        type = "source"
        isConnectable = { true }
        />{" "} <
        Handle position = "left"
        style = {
            {
                background: isConnected ? "#b4b4b6" : "#ececec",
                position: "absolute",
                top: "50%",
                transform: "translateY(-50%)",
            }
        }
        id = { `${dataAttr.id}-handle-left` }
        type = "source"
        isConnectable = { true }
        />{" "} <
        /div>
    );
};

export default CustomAttribute;