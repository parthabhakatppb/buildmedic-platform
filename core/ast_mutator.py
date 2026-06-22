import ast

class FunctionTargetMutator(ast.NodeTransformer):
    """
    Traverses the Abstract Syntax Tree to find and safely replace 
    the target broken function without disturbing surrounding structures.
    """
    def __init__(self, target_function_name: str, patch_source_code: str):
        self.target_name = target_function_name
        # Parse the patch source string into an executable AST node block
        self.patch_ast = ast.parse(patch_source_code).body[0]

    def visit_FunctionDef(self, node):
        if node.name == self.target_name:
            # Maintain the structural integrity of the original definition metadata
            return ast.copy_location(self.patch_ast, node)
        return self.generic_visit(node)

def apply_ast_patch(source_code: str, target_function: str, patch_block: str) -> str:
    try:
        parsed_tree = ast.parse(source_code)
        transformer = FunctionTargetMutator(target_function, patch_block)
        mutated_tree = transformer.visit(parsed_tree)
        ast.fix_missing_locations(mutated_tree)
        return ast.unparse(mutated_tree)
    except Exception as e:
        raise RuntimeError(f"AST Compiling/Parsing failure during structural patch: {str(e)}")