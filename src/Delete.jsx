import React from 'react';

export default function Delete({handleDelete}){




    return (
        <div className="delete-button">
            <button type="button" onClick={handleDelete}>Click to Exit</button>
        </div>
    )
}

