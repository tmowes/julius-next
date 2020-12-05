import styled, { css } from 'styled-components'

export const Container = styled.div`
  ${({ theme: { colors } }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    width: 100vh;
    color: ${colors.orange};
  `}
`
