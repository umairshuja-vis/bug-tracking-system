import { z } from 'zod';

export const signupSchema = z.object( {
  name: z.string().min( 3, 'name required' ),
  email: z.string().email( 'Invalid email' ),
  phone: z.string().min( 8, 'phone must be minimum 8 numbers' ).optional().or( z.literal( '' ) ),
  password: z.string().min( 8, 'Password must be min 8 characters' ),
  confirmPassword: z.string().min( 1, 'please confirm your password' ),
  user_type: z.enum( ['manager', 'qa', 'developer']),
} ).refine( ( data ) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
} ).superRefine( ( data, ctx ) => {
  if ( !data.user_type ) {
    ctx.addIssue( {
      code: z.ZodIssueCode.custom,
      message: 'User type is required',
      path: ['user_type'],
    } );
  }
} );

export const loginSchema = z.object( {
  email: z.string().email( 'Invalid email' ),
  password: z.string().min( 8, 'Password must be min 8 numbers' ),
} );

export const projectSchema = z.object( {
  name: z.string().min( 3, 'min 3 chars' ),
  description: z.string().min( 5, 'min 5 characters' ),
  logo: z.any().optional(),
  users: z.array( z.object( {
    id: z.number(),
    type: z.enum( ['qa', 'developer'] ),
  } ) ).default( [] ),
} );

export const bugSchema = z.object( {
  title: z.string().min( 3, 'min 3 chars' ),
  description: z.string().min( 5, 'min 5 characters' ),
  type: z.enum( ['bug', 'feature'] ),
  deadline: z.string().min( 1, 'Deadline is required' ),
  screenshot: z.any().optional(),
  bug_assignee: z.number().default( 0 )
} )
export type SignupFormData = z.infer<typeof signupSchema>;
export type LoginFormData = z.infer<typeof loginSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
