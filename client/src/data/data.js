const data = [
  {
    id: 11112,
    label: "Diagram 1",
    nodes: [
      {
        id: "1",
        type: "customNode",
        position: {
          x: 100,
          y: 100,
        },
        data: {
          label: "Entity 1",
          attributes: [
            {
              id: "e1",
              label: "Attribute 1",
              type: "String",
            },
            {
              id: "e2",
              label: "Attribute 2",
              type: "Integer",
            },
            {
              id: "e3",
              label: "Attribute 3",
              type: "Integer",
            },
            {
              id: "e4",
              label: "Attribute 4",
              type: "Integer",
            },
            {
              id: "e5",
              label: "Attribute 5",
              type: "Integer",
            },
          ],
        },
      },
      {
        id: "2",
        type: "customNode",
        position: {
          x: 400,
          y: 100,
        },
        data: {
          label: "Entity 2",
          attributes: [
            {
              id: "e6",
              label: "Attribute 6",
              type: "Date",
            },
            {
              id: "e7",
              label: "Attribute 7",
              type: "String",
            },
          ],
        },
      },
    ],
    edges: [
      {
        id: "e1-e6",
        source: "1",
        target: "2",
        sourceHandle: "e5-handle",
        targetHandle: "e7-handle",
        type: "default",
      },
    ],
  },
  {
    id: 2222,
    label: "Diagram 2",
    nodes: [
      {
        id: "1",
        type: "customNode",
        position: {
          x: 100,
          y: 100,
        },
        data: {
          label: "Entity 1",
          attributes: [],
        },
      },
    ],
    edges: [],
  },
];

export default data;
