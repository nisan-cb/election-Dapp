import LensIcon from '@mui/icons-material/Lens';
import RatingMUI from '@mui/material/Rating';
import { FC } from 'react';


interface RatingI {
    value?: number | null | undefined
    onChange?: (value: number) => void
}

const Rating: FC<RatingI> = ({ value, onChange }) => {

    const onChangeHandler = (_event: React.SyntheticEvent<Element, Event>, value: number | null) => {
        if (value)
            onChange?.(value)
    }

    return (

        <RatingMUI value={value} icon={<LensIcon />} emptyIcon={<LensIcon color="action" />} onChange={onChangeHandler} />
    )
}

export default Rating;
